const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const Sequelize = require("sequelize");
const { User, Item, Trade } = require("./models");
const { Op } = require("sequelize");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'public/images/' });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/public/images', express.static('images'));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 2592000000,
    },
  })
);

//test for accessibility
app.get("/heartbeat", (req, res) => {
  res.json({
    is: "working",
  });
});

app.get("/list-items", async (req, res) => {
  const items = await Item.findAll({
      where: {
        userAccount: req.session.user
      }
  });
  res.json(items);
});

app.post('/new-item', upload.single('image'), async (req, res) => {
  // req.body contains an Object with firstName, lastName, email
 const { description, category, userAccount } = req.body;
 const image = req.file.filename;
 
 const newPost = await Item.create({
     description,
     image,
     category,
     userAccount, 
 });
 
 // Send back the new user's ID in the response:
 res.send([{
  "description": description,
  "image": image,
  "category": category
}])
})

app.post('/update-item', upload.single('image'), async (req, res) => {
  // req.body contains an Object with firstName, lastName, email
 const { description, category, userAccount } = req.body;
 const image = req.file.filename;
 
 const newPost = await Item.update({
     description,
     image,
     category, 
 },{
  where:{
    userAccount: userAccount
  }
 });
 
 // Send back the new user's ID in the response:
 res.send([{
     "description": description,
     "image": image,
     "category": category
}])
})

app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const readStream = fs.createReadStream(`public/images/${imageName}`);
  readStream.pipe(res);
})

app.delete("/delete-item/:id", async (req, res) => {
  const { id } = req.params;
  const removeItem = await Item.destroy({
    where: {
      id,
    },
  });
  res.json(removeItem);
});

app.get("/check-auth", async (req, res) => {
  if (req.session.user) {
    res.send({
      isLoggedIn: !(req.session.user == null),
      email: req.session.user,
    });
  } else {
    res.send({
      isLoggedIn: !(req.session.user == null),
      email: "unassigned",
    });
  }
});

app.post("/login", async (req, res) => {
  const user = await User.findAll({
    where: {
      email: {
        [Op.eq]: req.body.email,
      },
    },
  });
  if (user[0] == null) {
    res.json({ success: false, message: "Email or password invalid" });
  } else {
    bcrypt.compare(req.body.password, user[0].password, function (err, result) {
      if (result && req.body.email === user[0].email) {
        req.session.user = req.body.email;
        res.json({ success: true, message: "Login success", userID: user[0].id });
      } else {
        res.json({ success: false, message: "Email or password invalid" });
      }
    });
  }
});

app.post("/create_account", async (req, res) => {
  const user = await User.findAll({
    where: {
      email: {
        [Op.eq]: req.body.email,
      },
    },
  });
  if (user[0] == null) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      User.create({ email: req.body.email, password: hash });
    });
    res.json({ success: true, message: "Create success" });
  } else {
    res.json({ success: false, message: "Email or password invalid" });
  }
});

app.get("/logout", async (req, res) => {
  req.session.destroy();
  res.send({
    isLoggedIn: false,
  });
});

//routes for Item Browsing
//All Item Fetch
app.get("/fetchAllItems", async (req, res) => {
  const items = await Item.findAll();
  res.json(items);
});

//Catagory Fetch used in ItemBrowsePage.js component
app.get("/fetchCatagory/:catagory", async (req, res) => {
  const { catagory } = req.params;
  const items = await Item.findAll({
    where: {
      category: catagory,
    },
  });
  res.json(items);
});

//Route for My Item
app.get("/myItem/:userId", async (req, res) => {
  const { userId } = req.params;
  const myItem = await Item.findAll({
    where: {
      userID: userId,
    },
  });
  res.json(myItem)
});

//Route to Trade Item used in TradeButton.js component
app.post("/Trade", async(req,res) => {
  const { offerorID, offereeID, itemID} =req.body;
  const NewTrade = await Trade.create({
    offerorID,
    offereeID,
    itemID
  })
  res.json({
    id:NewTrade.ID,
  })
})

//routes for fetching offers
app.get("/fetchoffers/:id" , async (req, res) => {
  const { id } =req.params;
  const offers = await Trade.findAll({
    where: {
      offereeID: id
    }
  })
  res.json(offers) 
})

/* Main app routes */

const server = app.listen(3001, function () {
  console.log("listening on port 3001");
});
