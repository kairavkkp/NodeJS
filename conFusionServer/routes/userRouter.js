var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/users');
const { route } = require('.');
var passport = require('passport')
var authenticate = require('../authenticate');
const { restart } = require('nodemon');
const cors = require('./cors')

var router = express.Router();

router.use(bodyParser.json())
/* GET users listing. */


router.get('/',cors.corsWithOptions,authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then((user)=>{
    res.setHeader('Content-Type','application/json')
    res.statusCode = 200
    res.json(user)
  })
});

router.post('/signup',cors.corsWithOptions,(req,res,next)=>{
  User.register(new User({username:req.body.username}),req.body.password,
  (err,user)=>{

    if(err){
      res.statusCode = 500
      res.setHeader('Content-Type','application/json')
      res.json({err:err})
      
    } 
    else{
      if (req.body.firstname)
        user.firstname = req.body.firstname
      if (req.body.lastname)
        user.lastname = req.body.lastname

      user.save((err,user)=>{

        if(err){
          res.statusCode = 500
          res.setHeader('Content-Type','application/json')
          res.json({err:err})
          return
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200
          res.setHeader('Content-Type','application/json')
          res.json({success:true,status:"Registration Successful"})
      })
      
     });
    }
  });
});

router.post('/login',cors.corsWithOptions,passport.authenticate('local'),(req,res,)=>{

      var token = authenticate.getToken({_id:req.user._id})
      res.statusCode = 200
      res.setHeader('Content-Type','application/json')
      res.json({success:true,token:token,status:"You are successfuly logged in!"})
});

router.get('/logout',cors.corsWithOptions,(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/')
  }
  else{
    var err = new Error('You are not logged-in!')
    err.status = 403
    next(err)
  }
})

router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res)=>{
  if(req.user){
    var token = authenticate.getToken({_id:req.user.id})
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json({success:true,token:token,status:"You are successfuly logged in!"})
  }
})

module.exports = router;
