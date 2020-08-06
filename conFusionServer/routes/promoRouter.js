const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const Promotions = require('../models/promotions')
const promoRouter = express.Router()
const authenticate = require('../authenticate')
const cors = require('./cors')
promoRouter.use(bodyParser.json())
promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus=200})
.get(cors.cors,(req,res,next) => {
   Promotions.find({})
   .then((promotion)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(promotion)
   },(err)=>next(err))
   .catch((err)=>console.log(err))

})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Promotions.create(req.body)
    .then((promotion)=>{
        console.log("Promotion Created ",promotion)
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(promotion)
   },(err)=>next(err))
   .catch((err)=>console.log(err))

})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403
    res.end("PUT operation nor supported on /promotions")
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Promotions.deleteMany({})
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
   },(err)=>next(err))
   .catch((err)=>console.log(err))
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus=200})

.get(cors.cors,(req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(promotion)
   },(err)=>next(err))
   .catch((err)=>console.log(err))

})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403
    res.end("POST Operation not supported on /promotions/"+req.params.promoId)

})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
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
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
   },(err)=>next(err))
   .catch((err)=>console.log(err))
});


module.exports = promoRouter;



