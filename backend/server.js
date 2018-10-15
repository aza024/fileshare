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
});

// ------------------APP.GET----------------------
app.get('/', (req, res) => {res.sendFile(__dirname + '/public/views/signup.html');});

app.get('/files/:username/:filename', (req, res)=>{
    //URI Encoding to prevent invalid chars for user & filename in S3 path
    const 
        username = encodeURIComponent(req.params.username),
        filename = encodeURIComponent(req.params.filename),

    //Bucket = root dir, Key = rest of S3 path
        params = {
            Bucket: "fileshare-uploads",
            Key: `userfiles/${username}/${filename}`,
        }

    s3.getObject(params, (err, data)=>{
        if (err){
            console.log("ERR: S3.getObject " + err)
            res.sendStatus(500)
            return
        }
        //Body - file content
        const fileData = data.Body
        console.log(`INFO: Successfully retrieved object from ${params.Bucket}/${params.Key}.`)
        res.json(data)
    })
})
//call jwt token
app.get('/listfiles/:username', verifyToken, (req, res)=> {
    const username = encodeURIComponent(req.params.username)
    console.log('INFO: Handling list files req for: ' + username)

    s3.listObjects({ 
        Bucket:'fileshare-uploads', 
        Prefix:`userfiles/${username}/`
    },
    (err,data)=>{
        if(err){
            console.log("ERR: S3.listFile " + err)
            res.status(500)
            return 
        }

        // Filenames were URI encoded before upload, decode so they are
        // readable by humans
        for (let i=0 ; i<data.Contents.length ; i++) {
            let decodedFilename = decodeURIComponent(data.Contents[i].Key)
            data.Contents[i].Key = decodedFilename
            console.log('INFO: Decoded File: ' + decodedFilename)
        }

        console.log('INFO: Retrieved list of files: ' + JSON.stringify(data))
        res.send(data)
    })
})

function login(username, password, hashed_password, res) {
    const str_hashed_password = ''+hashed_password
    bcrypt.compare(password, str_hashed_password, (err, hash_result) => {
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
                    res.status(400).json({error : "Username or password is incorrect."})
                } else {
                    //redirect to page with results from query
                    const user = {
                        id: psql_res.rows[0].user_id, 
                        username: psql_res.rows[0].username,
                        email: psql_res.rows[0].email
                    }
                    
                    jwt.sign(
                        {user},
                        'secretkey',
                        { expiresIn: '12h'},
                        // TODO: Handle Err
                        (err,token) => {
                            res.json({token})
                            res.status(200)
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
        if(err){
            console.log('ERR: Login query error ' + err)
            res.status(500)
            return
        }

        if (psql_res.rows.length === 0 ){
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

    bcrypt.hash(password, 10, (err, hash)=>{ 
        if (err){
            res.status(500)
            return
        }
        client.query(
            'SELECT * FROM users WHERE username = $1', 
                [username],
            (err,psql_res) => {
                if(err){
                    console.log('ERR: Select err '+ err)
                    res.status(500)
                        return
                }
                console.log(psql_res)
                if (psql_res.rows.length!=0) {
                    console.log('ERR: Account already exists: ' + username)
                    res.status(400).json({ error : 'ERR: Account already exists: ' + username })
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
                                jwt.sign({user}, 'secretkey', { expiresIn: '12h'}, (err,token)=>{
                                    res.json({token})
                                    window.location.replace('views/files.html')
                                    res.status(200)
                                });
                            }
                        )
                }
            })
        }
    )
})

//Get filename & file data from appropriate upload depending on where file is uploaded from
app.post('/files/:username', upload.single('myfile'), (req, res) => {
    let name = null,
        data = null

    if(!req.file){
        name = req.body.filename
        data = req.body.content
    } else{
        name = req.file.originalname
        data = req.file.buffer
    }

    if(!name || !data){
        console.log('ERR: Name or Data not valid')
        res.sendStatus(400).json({error: 'Invalid Name or Data'})
        return
    }

    const username = req.params.username

    if (!username){
        console.log("ERR: Username required")
        res.sendStatus(400).json({error : 'Username Required'})
        return
    }

    const urlName = encodeURIComponent(name)
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
    })
})

// app.get('/test', verifyToken, (req, res)=>{
//     console.log('TOKEN ')
// })

// #TODO change secret key and add to .env file
app.post('/account', verifyToken, (req,res) => {
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
        if(err) {
            res.sendStatus(403)
        } else {
            res.json({
                message:'Account Created',
                authData
            })
        }
    })
})

app.get('/files/delete/:username/:filename', verifyToken,(req,res)=>{      
    const username = req.params.username,
        filename = req.params.filename
    
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
            if(err) {
                console.log('Delete Err')
                res.sendStatus(403)
            } else {
                res.json({
                    message:'File Deleted',
                    authData
                })
                var deleteParam = {
                    Bucket: 'fileshare-uploads',
                 
                    Delete: {
                        Objects: [
                            {Key: `userfiles/${username}/${filename}`},
                        ]
                    }
                };    
                s3.deleteObjects(deleteParam, function(err, data) {
                    if(err){ 
                        console.log(err, err.stack) 
                        return (err)
                    }
                    else{
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
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()

    } else {
        console.log('FORBIDDEN')
        res.sendStatus(403).json({error : 'ERR: Unauthorized to view this page'})
    }
}

app.listen(3001, () => {
    console.log('Listening on port 3001')
})