var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var fs = require("fs");
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sha512 = require('sha512');

// setup User model and its fields.
var Task = sequelize.define('tasks', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    seedReward: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    reporter: {
        type: Sequelize.STRING,
        allowNull: false
    },
    assignee: {
        type: Sequelize.STRING
    },
    reviewer: {
        type: Sequelize.STRING,
        allowNull: false
    },
    kanbanState: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    parentProject: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
      beforeCreate: (task) => {
        task.id = sha512(task.name);
        task.id = task.id.toString('hex');
        task.kanbanState = 1;
      }
    } 

});
 
// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('task table has been created if it does not yet exist'))
    .catch(error => console.log('Error creating task table:', error));

// export User model for use in other files.
module.exports = Task;