const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const Sequelize = require('sequelize');
const { User, Item, Trade } = require('./models');
const { Op } = require('sequelize');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 2592000000,
     } 
  })
);

//test for accessibility
app.get('/heartbeat', (req, res) => {
    res.json({
        "is": "working"
    })
});

/*app.get('/check-auth', async(req, res) => {
  if(req.session.user) {
    res.send({
      isLoggedIn: !(req.session.user == null),
      username: req.session.user,
      });
  } else {
    res.send({
      isLoggedIn: !(req.session.user == null),
      username: 'unassigned',
      });
  }
});

app.post('/login', async(req, res) => {
  const user = await User.findAll({
    where: {
      username: {
        [Op.eq]: req.body.username
      }
    }
  });
  if(user[0] == null) {
    res.json({success: false, message: 'Username or password invalid'});
  } else {
    bcrypt.compare(req.body.passphrase, user[0].password, function(err, result) {
      if ((result) && (req.body.username === user[0].username)) {
        req.session.user = req.body.username;
        res.json({success: true, message: 'Login success'});
      } else {
        res.json({success: false, message: 'Username or password invalid'});
      }
    });
  }
});

app.post('/create_account', async(req, res) => {
  const user = await User.findAll({
    where: {
      username: {
        [Op.eq]: req.body.username
      }
    }
  });
  if(user[0] == null) {
    bcrypt.hash(req.body.passphrase, 10, function(err, hash) {
        User.create({username: req.body.username, password: hash});
        Folder.create({name: 'notes', user: req.body.username})
    });
    res.json({success: true, message: 'Create success'});
  } else {
    res.json({success: false, message: 'Username or password invalid'});
  }
});

app.get('/logout', async(req, res) => {
  req.session.destroy();
  res.send({
    isLoggedIn: false,
    });
});

/* Main app routes */


const server = app.listen(3001, function() {
    console.log('listening on port 3001');
});