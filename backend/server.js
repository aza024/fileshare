const 
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    { Client } = require('pg'),
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
// app.get('/files/:username', (req, res) => {res.sendFile(__dirname + '/public/views/files.html');});
// app.get('/signup', (req, res) => {res.sendFile(__dirname + '/public/views/signup.html');});

app.get('/files/:username/:filename', (req, res)=>{
    const 
        username = encodeURIComponent(req.params.username),
        filename = encodeURIComponent(req.params.filename),
        
        params = {
            Bucket: "fileshare-uploads",
            Key: `userfiles/${username}/${filename}`,
        }
        // console.log(`userfiles/${username}/${filename}`)
        // console.log(username)
        // console.log(filename)

    s3.getObject(params, (err, data)=>{
        if (err){
            console.log("S3.getObject Error " + err)
            res.sendStatus(500)
            return
        }
        
        console.log("Data " + JSON.stringify(data))
        //Body - file content
        const fileData = data.Body
        console.log("DATA"+fileData)
        
        res.json(data)
    })
})

app.get('/listfiles/:username', (req, res)=> {
    const 
    username = encodeURIComponent(req.params.username)
    console.log(username)

    s3.listObjects({ 
        Bucket:'fileshare-uploads', 
        Prefix:`userfiles/${username}/`
    },
    (err,data)=>{
        if(err){
            console.log("S3.listFile Error " + err)
            res.sendStatus(500)
            return 
        }
        console.log('LIST OF FILES' + JSON.stringify(data))
        res.send(data)
    })
})

function login(email, password, hashed_password, res) {
    const str_hashed_password = ''+hashed_password
    bcrypt.compare(password, str_hashed_password, (err, hash_result) => {
        if(err){
            console.log('Bcrypt Error ' + err)
            res.status(500)
            return
        }
        console.log(hash_result)
        console.log(str_hashed_password)
        if(!hash_result) {
            console.log('Email or password did not match')
            res.status(400)
            return
        }             
        // Passwords match
        client.query(
            'SELECT * FROM users WHERE email = $1 and password = $2',
                [email, hashed_password],
            (err,psql_res) => {
                if (psql_res.rows.length === 0) {
                    console.log('Email or password is incorrect.')
                    res.status(400)
                } else {
                    //redirect to page with results from query
                    // console.log(psql_res.rows[0])
                    const user = {
                        id: psql_res.rows[0].user_id, 
                        username: psql_res.rows[0].username,
                        email: psql_res.rows[0].email
                    }
                    
                    jwt.sign(
                        {user},
                        'secretkey',
                        { expiresIn: '12h'},
                        (err,token) => {
                            res.json({token})
                            res.status(200)
                        }
                    );
                    console.log('redirect to profile page')
                }
            }
        )
      }); 
}

app.get('/user', (req,res) => {
    console.log('In app.get(/user) ')
    // console.log(req)
    const 
    email = req.query.email, 
    password = req.query.password 
    console.log(email)
    console.log(password)
    

    client.query('SELECT password FROM users WHERE email = $1',
    [email], (err, psql_res)=>{
        if(err){
            console.log('Login query error ' + err)
            res.status(500)
            return
        }

        if (psql_res.rows.length === 0 ){
            console.log('Email does not exist')
            res.status(400)
            return
        }

        const hashed_password = psql_res.rows[0].password
        login(email, password, hashed_password, res)
    })
})

// ------------------APP.POST----------------------

app.post('/user/:username', (req,res) => {
    const 
        username = req.body.username,
        password = req.body.password,
        email = req.body.email 
        console.log('username ' + username)   

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
                    console.log('select err '+ err)
                    res.status(500)
                        return
                }
                console.log(psql_res)
                if (psql_res.rows.length!=0) {
                    console.log('Account already exists: ' + username)
                    res.status(400)
                } else {
                    //use uuid for jwt token
                    const user_id = uuidv4() 
                        client.query(
                            `INSERT INTO users (username, password, email, user_id) VALUES($1, $2, $3, $4)`,
                                [username, hash, email, user_id],
                            (err,psql_res) => {
                                if (err) {
                                    console.log('insert err' + JSON.stringify(err))
                                    res.status(500)
                                    return
                                }
                                const user = {
                                    id: user_id, 
                                    username,
                                    email
                                }
                                jwt.sign({user}, 'secretkey', { expiresIn: '12h'}, (err,token)=>{

                                    console.log('IN SECRET KEY')
                                    res.json({token})
                                    console.log('after token')
                                    //GET REQUEST
                                    console.log('before redir')
                                    // res.redirect('/views/files.html')
                                    console.log('after redir b4 windo.rep')
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

app.post('/files/:username', upload.single('myfile'), (req, res) => {
    const name = req.file.originalname
    const data = req.file.buffer
    // TODO: add username instead of hardcode: const username = req.body.username
    const username = req.params.username
    // console.log(req.body)

    if (!username){
        console.log("Username required")
        res.sendStatus(400)
        return
    }

    const urlName = encodeURIComponent(name)
    console.log("uploading data")
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
        res.sendStatus(403)
    }
}

app.listen(3001, () => {
    console.log('Listening on port 3001')
})