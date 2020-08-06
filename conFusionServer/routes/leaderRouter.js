const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const Leaders = require('../models/leaders')
const authenticate = require('../authenticate')
const leaderRouter = express.Router()
const cors = require('./cors')

leaderRouter.use(bodyParser.json())
leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus=200})
.get(cors.cors,(req,res,next) => {
    Leaders.find({})
    .then((leader)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(leader)
    },(err)=>next(err))
    .catch((err)=>console.log(err))

})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {


    Leaders.create(req.body)
    .then((leader)=>{
        console.log("Leader Created ",leader)
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(leader)

    },(err)=>next(err))
    .catch((err)=>console.log(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403
    res.end("PUT operation nor supported on /leaders")
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Leaders.deleteMany({})
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
    },(err)=>next(err))
    .catch((err)=>console.log(err))
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus=200})

.get(cors.cors,(req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },(err)=>next(err))
    .catch((err)=>console.log(err))

})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403
    res.end("POST Operation not supported on /leaders/"+req.params.leaderId)

})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{
        new:true
    })
    .then((leader)=>{
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },(err)=>next(err))
    .catch((err)=>console.log(err))
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader("Content-Type","application/json")
        res.json(resp)
    },(err)=>next(err))
    .catch((err)=>console.log(err))
});


module.exports = leaderRouter;



