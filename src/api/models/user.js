var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var fs = require("fs");
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sha512 = require('sha512');

// setup User model and its fields.
var User = sequelize.define('users', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
      beforeCreate: (user) => {
        user.password = sha512(user.password);
        user.password = user.password.toString('hex');
        user.id = sha512(user.id);
        user.id = user.id.toString('hex');
      }
    } 

});
 
// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('user table has been created if it does not yet exist'))
    .catch(error => console.log('Error creating users table:', error));

// export User model for use in other files.
module.exports = User;