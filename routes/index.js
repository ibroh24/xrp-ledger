var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var con = require('../database/connection');

const RippleAPI = require('ripple-lib').RippleAPI;

// const { apiOptions } = require('ripple-lib/dist/npm/common/validate');


/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.flag == 1){
    req.session.destroy();
    res.render('index', { title: 'xrp project', message: 'Email already exist', flag: 1 });
  }else if(req.session.flag == 2){
    req.session.destroy();
    res.render('index', { title: 'xrp project',  message: 'Registration Successful, Please login', flag: 0  });
  }else if(req.session.flag == 3){
    req.session.destroy();
    res.render('index', { title: 'xrp project',  message: 'Confirm password does not match', flag: 1  });
  }else if(req.session.flag == 4){
    req.session.destroy();
    res.render('index', { title: 'xrp project',  message: 'Incorrect email or password', flag: 1  });
  }else{
    res.render('index', { title: 'xrp project'});
  }
  
});

// handling post request
router.post('/auth_register', function (req, res, next) { 
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  if(cpassword == password){
    var mysql = 'SELECT * FROM users WHERE email = ?;';

    con.query(mysql,[email], function (err, result, fields) { 
      if(err) throw err;
      if(result.length > 0){
        req.session.flag = 1;
        res.redirect('/register');

      }else{
        var hashPassword = bcrypt.hashSync(password, 10);
        var sql = 'INSERT INTO users(name, email, password) VALUES(?,?,?);';

        con.query(sql, [name, email, hashPassword], function (err, result, fields) { 
          if(err) throw err;
          req.session.flag = 2;

          res.redirect('/login');
        });
      }

    });
  }else{
    req.session.flag = 1;
    res.redirect('/register');
  }
});

// handling post request for login
router.post('/auth_login', function (req, res, next) { 
  var email = req.body.email;
  var password = req.body.password;
  
  var mysql = 'SELECT * FROM users WHERE email = ?;';
  con.query(mysql,[email], function (err, result, fields) { 
    if(err) throw err;
    if(result.length && bcrypt.compareSync(password, result[0].password)){
      req.session.email = email;
      res.redirect('/home');
    }else{
      req.session.flag = 4;
      res.redirect('/');
    }
  });
});

// home route
router.get('/home', function (req, res, next) { 
 
    res.render('home', {message: 'Welcome '+ req.session.email});

  // res.render('home', {message: 'Welcome '+ req.session.email,info});


});

router.get('/register', function (req, res, next) { 
  res.render('register');
});

router.get('/index', function (req, res, next) { 
  res.render('index');
});

// logout route
router.get('/logout', function (req, res, next) { 
  if(req.session.email){req.session.destroy();}
  res.redirect('/');
});

router.post('/home', function (req, res, next) { 
  const api = new RippleAPI({
    server: 'wss://s1.ripple.com' // Public rippled server
  });
  api.connect().then(()=>{
    const address = req.body.address;
    return api.getAccountInfo(address);
  }).then(info=>{
    // res.send(info);
    console.log(info);
    res.render('home', {message: 'Welcome '+ req.session.email, info: info});
  });
})


module.exports = router;
