const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const Favorites = require('../models/favorites')
const authenticate = require('../authenticate')
const cors = require('./cors')

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus = 200;
})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    const user_id = mongoose.Types.ObjectId(req.user._id)
    Favorites.findOne({user:user_id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=>{
        if(!favorites){
            var err = new Error('You have no favorites!')
            err.statusCode = 404
            return next(err)
        }
        res.setHeader('Content-Type','application/json')
        res.statusCode = 200
        res.json(favorites)
    })
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    
    const user_id = mongoose.Types.ObjectId(req.user._id)
    Favorites.findOne({user:user_id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=>{
        console.log("Favourites : "+ favorites)
        var fav_user;
        console.log(favorites)
        if(favorites){
            fav_user = favorites
            console.log('Fav User ', fav_user)
        }
        if(!fav_user){
            fav_user = new Favorites({user:req.user._id})
            fav_user.save()
            console.log(fav_user)
        }
     
        Favorites.findByIdAndUpdate(fav_user._id,{$set : {dishes:req.body.dishes}},{new:true})
        .then((fav)=>console.log(fav))
        fav_user.save()
        .then((updatedFav)=>{
            res.setHeader('Content-Type','application/json')
            res.statusCode = 200
            res.json(updatedFav)
        },(err)=>next(err))
        .catch((err)=>console.log(err))
        
        


        }

    ,(err)=>next(err))
    .catch((err)=>console.log(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403
    res.end("PUT Operation not supported on /favorites")
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    const user_id = mongoose.Types.ObjectId(req.user._id)
    Favorites.findOneAndDelete({user:user_id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=>{
        if(!favorites){
            var err = new Error('You dont have any favorites to remove!')
            err.statusCode = 404
            return next(err)
        }
        res.setHeader('Content-Type','application/json')
        res.statusCode = 200
        res.json(favorites)
    })

})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus = 200;
})

.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403
    res.end("GET Operation not supported on /favorites/:dishId")
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    const user_id = mongoose.Types.ObjectId(req.user._id)
    Favorites.findOne({user:user_id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=>{
        console.log("Favourites : "+ favorites)
        var fav_user;
        console.log(favorites)
        if(favorites){
            fav_user = favorites
            console.log('Fav User ', fav_user)
        }
        if(!fav_user){
            fav_user = new Favorites({user:req.user._id})
            fav_user.save()
            console.log(fav_user)
        }

        Favorites.findByIdAndUpdate(fav_user._id,{$addToSet : {dishes:req.params.dishId}})
        .populate('user')
        .populate('dishes')
        .then((fav)=>{
            res.setHeader('Content-Type','application/json')
            res.statusCode = 200
            res.json(fav)
        },(err)=>next(err))
        .catch((err)=>console.log(err))
        
        


    })
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403
    res.end("PUT Operation not supported on /favorites/:dishId")
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    const user_id = mongoose.Types.ObjectId(req.user._id)
    Favorites.findOne({user:user_id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=>{
        console.log("Favourites : "+ favorites)
        var fav_user;
        console.log(favorites)
        if(favorites){
            fav_user = favorites
            console.log('Fav User ', fav_user)
        }
        if(!fav_user){
            fav_user = new Favorites({user:req.user._id})
            fav_user.save()
            console.log("New Fav_User: ",fav_user)
        }
        fav_user.dishes.pop({_id:req.params.dishId})
        fav_user.save()
        .then((fav)=>{
            res.setHeader('Content-Type','application/json')
            res.statusCode = 200
            res.json(fav)
        },(err)=>next(err))
        .catch((err)=>console.log(err))
        
})

})


module.exports = favoriteRouter;