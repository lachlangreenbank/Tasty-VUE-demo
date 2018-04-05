var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var Project = require('./models/project');
var Task = require('./models/task');
var bcrypt = require('bcrypt');
var sha512 = require('sha512');
var server = require('http').createServer(app); 
var io = require('socket.io')(server);
var router = express.Router();
var fs = require("fs");
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, 'config.json'))[env];
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.username, config.password, config);



// invoke an instance of express application.
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://be01098f.ngrok.io");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.static(__dirname + '/public')); 

app.use('/public/test', express.static(__dirname + '/public/test'));
// set our application port
app.set('port', 9000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    //usename: '',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


//FIX THIS middleware and add to route calls FOR PRODUCTION ++++++++++++++++++++++++++++++++++++++++++++++   <-----


var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect(req.params);
    } else {
        next();
    }    
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});


// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/signup.html');
    })
    .post((req, res) => {

        id = sha512(req.body.email);
        id = id.toString('hex');

        User.create({
            id: id,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/home');
        })
        .catch(error => {
            res.redirect('/signup');
            console.log(error);
        });
    });




// route for user Login
app.route('/login')
    .get((req, res) => {
        res.sendFile(__dirname + '/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;
            console.log(password);

        User.findOne({ where: { username: username } }).then(function (user) {

            password = sha512(password);
            password = password.toString('hex');
             console.log( password)
            if (!user) {
                res.redirect('/login');
            } else if (!((user.toJSON()).password === password)) {
                res.redirect('/login');               
            } else {
                req.session.user = user.dataValues;
                res.redirect('/home');
            }
        });
    });


// route for Project creation

//get this with the post request ASAP TODO <-------
app.route('/create_project')
     .get((req, res) => {
        res.sendFile(__dirname + '/public/create_project.html');
    })
    .post((req, res) => {

        genId = sha512((req.body.title)+req.body.seedGoal);
        genId = genId.toString('hex');


        Project.create({
            id : genId,
            title : req.body.title,
            description : req.body.description,
            seedGoal : req.body.seedGoal, 
            seedBalance : 0,
            creator : 'YOU!!!!',
            cofounders : req.body.coFounders,
            genesisDate : 0,
            completionDate : req.body.completionDate,
            kanbanState : 1,
            parentProject : req.body.parentProject,
            projectDepth : req.body.projectDepth
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/home');
        })
        .catch(error => {
            res.redirect('/create_project.html');
            console.log(error);
        });
});

app.route('/create_task')
     .get((req, res) => {
        res.sendFile(__dirname + '/public/create_task.html');
    })
    .post((req, res) => {

        id = sha512(req.body.taskName);
        id = id.toString('hex');

        Task.create({
            id : id,
            name : req.body.taskName,
            description : req.body.description,
            seedReward : req.body.seedReward,
            reporter : 'YOU!!!!',
            assignee : req.body.assignee,
            reviewer : 'YOU!!!',
            kanbanState : 1,
            completionDate : req.body.completionDate,
            parentProject : req.body.parentProject
        })
        .then(user => {
            req.session.task = user.dataValues;
            res.redirect('/kanban');
        })
        .catch(error => {
            res.redirect('/create_task.html');
            console.log(error);
        });
});

 

// route for user's dashboard
app.get('/home', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/home.html');
    } else {
        res.redirect('/login');
    }
});

// route for user's dashboard
app.get('/lower_level_projects', (req, res) => {
    
        //get lower level (projects with a parent) and send to frontend. $ne = not equal to '' (nothing)
           Project.findAll({ where : {parentProject :{ $ne: '' }}}).then(function (data) {

            //Get the data and sort it into levels using the project_level (1,2,3..) feild
            //and pass back data with many lavels so that all levels are sorted and are able to be querysd locally
            //(ie data. 1stlvl  data.2ndlvl..)'

           res.send(data)
        });    
    
});

// route for user's dashboard
app.get('/project_query', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {

        //get projects and send to frontend
           Project.findAll({}).then(function (data) {
           res.send(data)
        });    
    } else {
        res.redirect('/login');
    }
});

app.get('/top_level_projects', (req, res) => {
     
    //get projects and send to frontend
       Project.findAll({where : {parentProject : ''}}).then(function (data) {
       res.send(data)
    });    
 
});

// route for user's dashboard
app.get('/user_query', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {

        //get usernames and ids and send to frontend
           sequelize.query("SELECT username, id FROM `users`", { type: sequelize.QueryTypes.SELECT})
           .then(function (data) {
           res.send(data)
        });    
    } else {
        res.redirect('/login');
    }
});






// route for user's dashboard
app.get('/task_query', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {


            console.log(req.query.projectId)
        //get tasks and send to frontend
           Task.findAll({ where: { parentProject: req.query.projectId }}).then(function (data) {
           res.send(data)
           console.log(data)
        });    
    } else {
        res.redirect('/login');
    }
});

// route for user's dashboard
app.get('/update_kanban', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {

        Task.update({ kanbanState: req.query.stateTo },{ where: { id: req.query.taskToUpdate } })
          .then( function (data) {
            // Check if record exists in db
 
            res.send(data)
          })    
    } else {
        res.redirect('/login');
    }
});
 



// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});


// route for user logout
app.get('/kanban', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/kanban.html');
    } else {
        res.clearCookie('user_sid');
        res.redirect('/login');
    }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
 

io.on('connection', function(client) { 
console.log('Client request to connect'); 

    if (req.session.user && req.cookies.user_sid) {
        client.on('join', function(data) { 
        console.log(data); 
        }); 

        client.on('messages', function(data) { 
        client.emit('broad', data); 
        client.broadcast.emit('broad',data); 
        console.log(data); 
        }); 
    }; 
});