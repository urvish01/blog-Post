const { Sequelize } = require('sequelize');
const config = require('../config')

const mysqlSequelize = new Sequelize({
    database:  config.db.database,
    password: config.db.password,
    username: config.db.username,
    host: config.db.host,
    dialect: 'mysql',
    logging: false
});



module.exports = mysqlSequelize;
 