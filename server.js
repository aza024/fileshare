const 
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    { Client }= require('pg'),
    multer = require('multer'),
    jwt = require('jsonwebtoken'),
    env = require('node-env-file'),
    AWS = require('aws-sdk'),
    upload = multer(),
    bcrypt = require('bcrypt'),
    uuidv4 = require('uuid/v4')

env(__dirname + '/.env');

const client = new Client(process.env.DB_CONNECT)
client.connect()
// create s3 client to talk to S3 service
const s3 = new AWS.S3()

AWS.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });

// ------------------APP.USE----------------------
app.use(express.static('public'))
app.use(bodyParser());
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }
);

// ------------------APP.GET----------------------
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/signup.html');
    }
);

app.get('', (req, res) => {
    res.sendFile(__dirname + '/public/views/signup.html');
    }
);

app.get('/shareFile/:username/:filename/:uuid', (req, res) => {
    console.log('INFO: Sharing file')
    res.sendFile(__dirname + '/public/views/share.html');
    }
);

app.get('/files/:username/:filename/:uuid', (req, res)=>{
    //URI Encoding to prevent invalid chars for user & filename in S3 path
    console.log("INFO:" + req.url)
    const 
        username = encodeURIComponent(req.params.username),
        filename = req.params.filename,
        uuid = req.params.uuid 

    console.log(`INFO: Retriving file: ${filename} with uuid ${uuid}`)

    if(!username || !filename || !uuid) {
        console.log("WARN: User did not provide username, filename, uuid")
        res.sendStatus(400).json({error: "Must send username, filename, and uuid"})
        return
    }

    const fullName = encodeURIComponent(`${filename}__${uuid}`)
    console.log(`INFO: fullName ${fullName}`)

    //Bucket = root dir, Key = rest of S3 path
    params = {
        Bucket: "fileshare-uploads",
        Key: `userfiles/${username}/${fullName}`,
    }

    s3.getObject(params, (err, data)=>{
        if (err){
            console.log("ERR: S3.getObject " + err)
            res.sendStatus(500)
            return
        }
        //Body - file content
        console.log(`INFO: Successfully retrieved object from ${params.Bucket}/${params.Key}`)
        res.json(data)
    })
})
//call jwt token
app.get('/listfiles/:username', verifyToken, (req, res) => {
    const username = encodeURIComponent(req.params.username)
    console.log('INFO: Handling list files req for: ' + username)
    s3.listObjects({ 
        Bucket:'fileshare-uploads', 
        Prefix:`userfiles/${username}/`
    },
    (err,data)=>{
        if (err) {
            console.log("ERR: S3.listFile " + err)
            res.status(500)
            return 
        }
        // Filenames were URI encoded before upload, decode so they are
        // readable by humans
        for (let i = 0; i < data.Contents.length; i++) {
            let decodedFilename = decodeURIComponent(data.Contents[i].Key)
            const 
                lastUU = decodedFilename.lastIndexOf('__'),
                uuid = decodedFilename.slice(lastUU + 2),
                filename = decodedFilename.substr(0, lastUU)
            
            data.Contents[i].Key = filename
            //send uuid down with filename
            data.Contents[i].uuid = uuid
            console.log('INFO: Decoded File: ' + decodedFilename)
        }
        console.log('INFO: Retrieved list of files: ' + JSON.stringify(data))
        res.send(data)
    })
})

function login(username, password, hashed_password, res) {
    console.log(`INFO: Logging user ${username} in`)
    const str_hashed_password = '' + hashed_password
    bcrypt.compare(
        password, 
        str_hashed_password, 
        (err, hash_result) => {
            if(err){
                console.log('ERR: Bcrypt Error ' + err)
                res.status(500)
                return
            }
            if(!hash_result) {
                console.log('ERR: Username or password did not match')
                res.status(400)
                return
            }             
            // Passwords match
            client.query(
                'SELECT * FROM users WHERE username = $1 and password = $2',
                    [username, hashed_password],
                (err,psql_res) => {
                    if (psql_res.rows.length === 0) {
                        console.log('ERR: Username or password is incorrect.')
                        res.status(400).json({
                            error : "Username or password is incorrect."
                        })
                        return;
                    } else {
                        //redirect to page with results from query
                        const user = {
                            id: psql_res.rows[0].user_id, 
                            username: psql_res.rows[0].username,
                            email: psql_res.rows[0].email
                        }
                        jwt.sign(
                        {user},
                        process.env.SECRET_KEY,
                        {expiresIn: '12h'},
                        (err,token) => {
                            if (err){
                                res.status(401)
                                return
                            }
                            res.json({token})
                            res.status(200)
                            return
                        }
                    );
                }
            }
        )
    }); 
}

app.get('/user', (req,res) => {
    const 
        username = req.query.username, 
        password = req.query.password

    console.log('INFO: User logging in ')

    client.query('SELECT password FROM users WHERE username = $1',
    [username], (err, psql_res)=>{
        if (err) {
            console.log('ERR: Login query error ' + err)
            res.status(500)
            return
        }
        if (psql_res.rows.length === 0 ) {
            console.log('INFO: Username does not exist')
            res.status(400).json({error : 'Username does not exist'})
            return
        }
        const hashed_password = psql_res.rows[0].password
        login(username, password, hashed_password, res)
    })
})

// ------------------APP.POST----------------------
// #TODO: REMOVE USERNAME = ALREADY PARM
app.post('/user/:username', (req,res) => {
    const 
        username = req.body.username,
        password = req.body.password,
        email = req.body.email

    console.log(`INFO: Creating user ${username}`)

    bcrypt.hash(
        password, 
        10, 
        (err, hash)=>{ 
        if (err) {
            res.status(500)
            return
        }

        console.log('INFO: Querying postgres for username')

        client.query(
            'SELECT * FROM users WHERE username = $1', 
                [username],
            (err,psql_res) => {
                if(err){
                    console.log('ERR: Select err '+ err)
                    res.status(500)
                    return
                }
                console.log('INFO: psql_res' + psql_res)
                if (psql_res.rows.length!=0) {
                    console.log('ERR: Account already exists: ' + username)
                    res.status(400).json({ error : 'ERR: Account already exists: ' + username })
                    return
                } else {
                    //use uuid for jwt token
                    const user_id = uuidv4() 
                        client.query(
                            `INSERT INTO users (username, password, email, user_id) VALUES($1, $2, $3, $4)`,
                                [username, hash, email, user_id],
                            (err,psql_res) => {
                                if (err) {
                                    console.log('ERR: Insert err' + JSON.stringify(err))
                                    res.status(500).json({error : 'ERR: User already exists.'})
                                    return
                                }
                                const user = {
                                    id: user_id, 
                                    username,
                                    email
                                }
                                console.log('key ' + process.env.SECRET_KEY)
                                jwt.sign({user}, 
                                    process.env.SECRET_KEY, 
                                    { expiresIn: '12h'}, 
                                    (err,token)=>{
                                    res.json({token})
                                    // window.location.replace('views/files.html')
                                    res.status(200)
                                    return
                                });
                            }
                        )
                }
            })
        }
    )
})

//Get filename & file data from appropriate upload depending on where file is uploaded from
app.post('/files/:username', 
    [verifyToken, upload.single('myfile')], 
    (req, res) => {
        console.log('in upload file ')
        jwt.verify(
            req.token, 
            process.env.SECRET_KEY, 
            (err, authData)=>{
            if (err) {
                console.log('ERR: FORBIDDEN')
                res.sendStatus(403).json({error: "FORBIDDEN"})
                return
            }
            let name = null,
                data = null
        
            if (!req.file) {
                name = req.body.filename
                data = req.body.content
            } else {
                name = req.file.originalname
                data = req.file.buffer
            }
        
            if (!name || !data) {
                console.log('ERR: Name or Data not valid')
                res.sendStatus(400).json({error: 'Invalid Name or Data'})
                return
            }
        
            const uuid = uuidv4()
            const username = req.params.username

            if (!username) {
                console.log("ERR: Username required")
                res.sendStatus(400).json({error : 'Username Required'})
                return
            }

            const urlName = encodeURIComponent(`${name}__${uuid}`)
            const params = {
                Bucket: "fileshare-uploads",
                Key: `userfiles/${username}/${urlName}`,
                Body: data
            }

            s3.putObject(params, (err, data) => {
                if (err){
                    console.log("Error " + err)
                    res.sendStatus(500)
                    return
                }
                
                console.log("Data " + data)
                res.sendStatus(200)
                return
            })
        })
})

app.post('/account', verifyToken, (req,res) => {
    jwt.verify(req.token, 
        process.env.SECRET_KEY, 
        (err, authData)=>{
        if (err) {
            res.sendStatus(403)
        } else {
            res.json({
                message:'Account Created',
                authData
            })
        }
    })
})

app.get('/files/delete/:username/:filename/:uuid', verifyToken,(req,res) => {      
    const 
        username = req.params.username,
        filename = req.params.filename,
        uuid = req.params.uuid

    console.log(`INFO: Handling delete for ${username}, filepath: ${filename}, ${uuid}`)
    
    jwt.verify(
        req.token, 
        process.env.SECRET_KEY, 
        (err, authData)=>{
            if (err) {
                console.log('ERR: Delete Err')
                res.sendStatus(403)
                return
            } else {
                res.json({
                    message:'File Deleted',
                    authData
                })
                var deleteParam = {
                    Bucket: 'fileshare-uploads',
                    Delete: {
                        Objects: [
                            {Key: `userfiles/${username}/${filename}__${uuid}`},
                        ]
                    }
                };    
                s3.deleteObjects(deleteParam, (err, data) => {
                    if (err) { 
                        console.log('ERR: Delete req failed with '+ err)
                        return (err)
                    }
                    else {
                        console.log('delete', data)
                        res.end('done')
                    }
                });
            }
        })
})


//verify token ** take with app.post ** 
function verifyToken (req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const 
            bearer = bearerHeader.split(' '),
            bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        console.log('ERR: FORBIDDEN')
        res.sendStatus(403).json({error : 'ERR: Unauthorized to view this page'})
    }
}

app.listen(3001, () => { console.log('Listening on port 3001') })

