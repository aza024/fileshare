const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { Client } = require('pg')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const env = require('node-env-file');

const AWS = require('aws-sdk')
env(__dirname + '/.env');

const client = new Client(process.env.DB_CONNECT)

client.connect()
// create s3 client to talk to S3 service
const s3 = new AWS.S3()
AWS.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });

var upload = multer()

// ------------------APP.USE----------------------
app.use(express.static('public'))
app.use(bodyParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// ------------------APP.GET----------------------
app.get('/', (req, res) => {res.sendFile(__dirname + '/public/views/index.html');});
app.get('/files', (req, res) => {res.sendFile(__dirname + '/public/views/files.html');});
app.get('/files/:username', (req, res)=>{
    const username = req.params.username
    const params2 = {
        Bucket: "fileshare-uploads",
        Key: `userfiles/${username}/myFile`,
    }
    s3.getObject(params2, (err, data)=>{
        if (err){
            console.log("Error " + err)
            res.sendStatus(500)
            return
        }
        console.log("Data " + JSON.stringify(data))
        const fileData = data.Body
        console.log("DATA"+fileData)
        res.sendStatus(200)
    })
})

// ------------------APP.POST----------------------

app.post('/user', (req,res)=>{
    console.log('in post user ' + req.body)
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    console.log('insert')
        
    client.query(
        'SELECT * FROM users WHERE username = $1',[username],
        (err,psql_res) => {
            console.log(psql_res)
            if(psql_res.rows.length!=0) {
                console.log('Username Exists: ' + username)
                res.status(400)
            } else {
                client.query(
                    `INSERT INTO users (username, password, email)
                     VALUES($1, $2, $3)`,
                     [username, password, email],
             
                     (err,psql_res) => {
             
                         console.log(psql_res)
                         console.log('query')

                        res.status(200)
             
                     }
                 )
            }
        }
     )
})

app.post('/files', upload.single('myfile'), (req, res) => {
    const name = req.file.originalname
    const data = req.file.buffer

    // TODO: add username instead of hardcode: const username = req.body.username
    const username = "Andrea"
    console.log(req.body)

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

app.post('/login', (req, res) => {
    //TODO: Mock User (make request to login - send username and password)
    const user = {
        id: 1, 
        username: 'andrea',
        email: 'andrea@example.com'
    }
    jwt.sign({user}, 'secretkey', { expiresIn: '12h'}, (err,token)=>{
        res.json({
            token
        })
    });
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