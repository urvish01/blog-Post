const express = require('express');
const cors = require('cors');
const mysqlSequelize = require("./db/mySequelize")
const config = require('./config')
const post = require('./routes/post')
const user = require('./routes/account.js');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// check for db connectivity
mysqlSequelize.authenticate()
  .then(() => {
    console.log('DB Connection has been established successfully.');
    // Synchronize models with the database 
    return mysqlSequelize.sync();
  })
  .catch((err)=> {
    console.log('Unable to connect to the DB Or unable to synce DB: %o', err);
    process.exit();	
});


app.get('/',(req, res)=>{
  res.status(200).json({ans : "hello, welcome to the Blog App"});
})

//Authentication(Login & Signup)
app.post('/signup', user.signUp );
app.post('/login', user.login );

app.post('/create-post', auth, post.create );
app.get('/my-post', auth, post.getPostById );
app.get('/all-post', post.getAllPost );

//Profile APIs
app.get('/my-profile',auth, user.myProfile );
app.get ('/all-profile', user.allProfiles )


// Start the server
app.listen(config.port, () => {
  console.log(`Server started on http://localhost:${config.port}`);
});
