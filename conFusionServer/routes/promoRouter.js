const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const Promotions = require('../models/promotions')
const promoRouter = express.Router()
const authenticate = require('../authenticate')
promoRouter.use(bodyParser.json())
promoRouter.route('/')
.get((req,res,next) => {
   Promotions.find({})
   .then((promotion)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(promotion)
   },(err)=>next(err))
   .catch((err)=>console.log(err))

})
.post(authenticate.verifyUser,(req,res,next) => {
    Promotions.create(req.body)
    .then((promotion)=>{
        console.log("Promotion Created ",promotion)
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(promotion)
   },(err)=>next(err))
   .catch((err)=>console.log(err))

})
.put(authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403
    res.end("PUT operation nor supported on /promotions")
})
.delete(authenticate.verifyUser,(req,res,next) => {
    Promotions.deleteMany({})
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
   },(err)=>next(err))
   .catch((err)=>console.log(err))
});

promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(promotion)
   },(err)=>next(err))
   .catch((err)=>console.log(err))

})
.post(authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403
    res.end("POST Operation not supported on /promotions/"+req.params.promoId)

})
.put(authenticate.verifyUser,(req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set:req.body
    },{
        new:true
    })
    .then((promotion)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(promotion)
   },(err)=>next(err))
   .catch((err)=>console.log(err))
})
.delete(authenticate.verifyUser,(req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
   },(err)=>next(err))
   .catch((err)=>console.log(err))
});


module.exports = promoRouter;



