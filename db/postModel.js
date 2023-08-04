const { DataTypes } = require('sequelize');
const mysqlSequelize = require('./mySequelize');
const accounts = require('./accountsModel');

const posts = mysqlSequelize.define('posts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    modifiedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }

});

posts.belongsTo(accounts, { foreignKey: 'userId' });
module.exports = posts;