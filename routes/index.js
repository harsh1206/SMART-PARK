const express = require('express');
const router = express.Router();
var numbers = new Array(40);
for (var i = 0; i < numbers.length; i++) {
  numbers[i] = 'bg-success';
}
const {
  ensureAuthenticated
} = require('../config/auth');
const Slot = require('../models/slots');
// Welcome Page
router.get('/', function (req, res) {

  if (req.user) {

    res.render('portfolio', {
      login: req.user
    })
  } else {
    res.render('welcome', {
      login: req.user
    });
  }
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, function (req, res) {
  processParking();
  var Transactions = [];
  db.collection('Slot').find({
    email: req.user.email
  }).toArray(function (err, result) {
    //console.log(result);
    for (var i = 0; i < result.length; i++) {
      Transactions.push(result[i].slot);
    }
    res.render('dashboard', {
      login: req.user,
      user: req.user,
      Transactions: Transactions
    });

  });
  //console.log(Transactions)
  // console.log(Transactions);

});

router.post('/monitor', function (req, res) {
  console.log(req.body);
  console.log(req.user.email);

  var myquery = {
    email: req.user.email
  };
  var newvalues = {
    $set: {
      rfid: req.body.RFID,
      model: req.body.Model
    }
  };
  db.collection("users").updateOne(myquery, newvalues, function (err, res) {
    if (err) throw err;
    // console.log(res)
    console.log("1 document updated");
  });
  res.render('monitor', {
    login: req.user,
    user: req.user,
    success_msg: "Entered"
  });
});

router.get('/monitor', ensureAuthenticated, (req, res) =>
  res.render('monitor', {
    login: req.user,
    user: req.user
  })
);

function processParking() {
  db.collection('Slot').find({}).toArray(function (err, result) {
    //console.log(result);
    for (var i = 0; i < result.length; i++) {
      numbers[parseInt(result[i].slot)] = "bg-danger";
    }
    // console.log(numbers);
  });
}
router.get('/parking', ensureAuthenticated, function (req, res) {
  // console.log(req.user);rs
  // for (var i = 0; i < numbers.length; i++) {
  //   numbers[i] = 'bg-success';
  // }
  processParking();

  res.render('parking', {
    login: req.user,
    user: req.user,
    success_msg: "",
    error_msg: "",
    color: numbers
  })

});


// Database for parking Slots 
const MongoClient = require('mongodb').MongoClient;
let db;
var url = "mongodb://localhost:27017/login";
MongoClient.connect(url, (err, database) => {
  if (err) {
    return console.log(err);
  }
  db = database.db('login');
  db.createCollection('Slot', function (err, res) {
    if (err) throw err;
    console.log("collection created");
  });
  console.log("connected to database ")
  // start the express web server listening on 8080
});
router.post('/parking', (req, res) => {
  // console.log(req.user);
  // console.log("post");
  // console.log(numbers)
  const slot = parseInt(req.body.slot);
  const newSlot = new Slot({
    email: req.user.email,
    slot: req.body.slot
  });
  if (slot > 0 && slot < 25) {
    db.collection('Slot').findOne({
      slot: req.body.slot
    }, function (err, result) {
      if (result == null) {
        numbers[slot] = "bg-danger";
        db.collection('Slot').insertOne(newSlot, (err, result) => {
          if (err) {
            return console.log(err);
          }
        });

        //  console.log("slot booked");

        res.render('parking', {
          login: req.user,
          user: req.user,
          success_msg: "Slot Booked",
          error_msg: "",
          color: numbers
        })
      } else {

        res.render('parking', {
          login: req.user,
          user: req.user,
          success_msg: "",
          error_msg: "Slot already Booked",
          color: numbers
        });
      }
    });
  } else {


    res.render('parking', {
      login: req.user,
      user: req.user,
      error_msg: "Please select Slot in range",
      color: numbers
    });
  }


});


module.exports = router;