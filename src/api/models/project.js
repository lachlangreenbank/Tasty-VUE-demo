var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var fs = require("fs");
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
 var sha512 = require('sha512');
 
 

var Project = sequelize.define('projects', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    seedGoal: {
        type: Sequelize.STRING,
        allowNull: false
    },
    seedBalance: {
        type: Sequelize.STRING,
        allowNull: false
    },
    creator: {
        type: Sequelize.STRING,
    },
    coFounders: {
        type: Sequelize.STRING,
    },
    genesisDate: {
        type: Sequelize.STRING,
        allowNull: false
    },
    completionDate: {
        type: Sequelize.STRING,
        allowNull: false
    },
    kanbanState: {
        type: Sequelize.INTEGER,
    },
    parentProject: {
        type: Sequelize.STRING,
    },
    projectDepth: {
        type: Sequelize.INTEGER,
    }
}, {
    hooks: {
      beforeCreate: (project) => {
        //TODO, get entered co creators id's 
        //and put them in an array
        project.id = sha512(project.title);
        project.id = project.id.toString('hex');
        project.kanbanState = 1;

        if (!project.projectDepth)
            project.projectDepth = 1;
      }
    } 

});


// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('project table have been created if it does not yet exist'))
    .catch(error => console.log('Error creating Projects table:', error));

// export User model for use in other files.
module.exports = Project;