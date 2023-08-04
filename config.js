const dotenv = require('dotenv')
dotenv.config();

// carete config 
const config = {
    port : process.env.PORT || 8000,
    db: {
        database: process.env.DB_NAME || 'blog_post',
        password: process.env.DB_PASSWORD || 'password',
        username: process.env.DB_USER || 'root',
        host: process.env.DB_HOST || 'localhost'
    },
    jwt :{
        secret : process.env.ACCESS_TOKEN_SECRET || 'thisisblogpostapp',
        TokenExpireTime : process.env.TOKEN_EXPIRE_TIME || '1h'
    }
}

module.exports = config;