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

app.get('/list-items', async (req, res) => {
  const items = await Item.findAll({
      attributes: ['id','description', 'category', 'image', 'createdAt']
  });
  res.json(items);
});

app.post('/new-item', async (req, res) => {
  // req.body contains an Object with firstName, lastName, email
 const { description, image, category } = req.body;
 const newPost = await Item.create({
     description,
     image,
     category 
 });
 
 // Send back the new user's ID in the response:
 res.json({
     id: newPost.id
})
})

app.delete('/delete-item/:id', async (req, res) => {
  const { id } = req.params;
  const removeItem = await Item.destroy({
      where:
       {
          id
      }
  });
  res.json(removeItem);
});

app.get('/check-auth', async(req, res) => {
  if(req.session.user) {
    res.send({
      isLoggedIn: !(req.session.user == null),
      email: req.session.user,
      });
  } else {
    res.send({
      isLoggedIn: !(req.session.user == null),
      email: 'unassigned',
      });
  }
});

app.post('/login', async(req, res) => {
  const user = await User.findAll({
    where: {
      email: {
        [Op.eq]: req.body.email
      }
    }
  });
  if(user[0] == null) {
    res.json({success: false, message: 'Email or password invalid'});
  } else {
    bcrypt.compare(req.body.password, user[0].password, function(err, result) {
      if ((result) && (req.body.email === user[0].email)) {
        req.session.user = req.body.email;
        res.json({success: true, message: 'Login success'});
      } else {
        res.json({success: false, message: 'Email or password invalid'});
      }
    });
  }
});

app.post('/create_account', async(req, res) => {
  const user = await User.findAll({
    where: {
      email: {
        [Op.eq]: req.body.email
      }
    }
  });
  if(user[0] == null) {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        User.create({email: req.body.email, password: hash});
    });
    res.json({success: true, message: 'Create success'});
  } else {
    res.json({success: false, message: 'Email or password invalid'});
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