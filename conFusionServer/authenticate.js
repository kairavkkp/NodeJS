var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('./models/users')
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt
var jwt = require('jsonwebtoken')
var FacebookTokenStrategy = require('passport-facebook-token')

var config = require('./config')
const e = require('express')
const users = require('./models/users')
const { UnavailableForLegalReasons } = require('http-errors')

exports.local = passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = function(user){
    return jwt.sign(user,config.secretKey,
        {
            expiresIn:36000
        })
}


var opts = {}



opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey;
// // // console.log(opts)
// // console.log("hereeeeeeeeeeeeeeee")


exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload,done)=>{
    console.log("JWT Payload : ", jwt_payload)
    User.findById({_id:jwt_payload._id},(err,user)=>{
        if(err){
            return done(err, false);
        }

        else if(user){
            return done(null,user);
        }
        else{
            
            return done(null,false);
        }
        
    })
}))



exports.verifyUser = passport.authenticate('jwt',{session:false})

exports.verifyAdmin = (req,res,next) => {
    var token = (req.headers.authorization.split(' ')[1])
    var verify = jwt.verify(token,config.secretKey,(err,decoded)=>{
        if(err){
            next(err)
        }
        else{
            //console.log(decoded)
            User.findById(decoded._id)
            .then((user)=>{
                if(user.admin == true){
                    next()
                }
                else{
                    var err = new Error('You are not authorized to perform this action!')
                    err.status = 403
                    return next(err)
                }
            })
        }
    })

}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID:config.facebook.clientId,
    clientSecret:config.facebook.clientSecret
},(accessToken,refreshToken,profile,done)=>{
    User.findOne({facebookId:profile.id},(err,user)=>{
        if(err){
            return done(err,false)
        }
        else{
            if(!err && user!=null){
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                return done(null,user);
            }
            else{
                user = new User({username:profile.displayName});
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err,user)=>{
                    if(err){
                        return done(err,null);
                    }
                    else{
                        return done(null,user);
                    }
                })
            }
        }
    })
}));