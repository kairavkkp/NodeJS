const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const Dishes = require('../models/dishes')
const authenticate = require('../authenticate')
const dishRouter = express.Router()
const cors = require('./cors')


dishRouter.use(bodyParser.json())


dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(dishes)
        
    },(err)=>next(err))
    .catch((err)=>console.log(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {

    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish Created ',dish)
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(dish)
    },(err)=>next(err))
    .catch((err)=>console.log(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403
    res.end("PUT Operation not supported on /dishes")

})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.deleteMany({})
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    },(err)=>next(err))
    .catch((err)=>console.log(err))

});



dishRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(dish)
        
    },(err)=>next(err))
    .catch((err)=>console.log(err))
    

})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403
    res.end("POST Operation not supported on /dishes/"+req.params.dishId)
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{
        new:true
    })
    .then((dish)=>{
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(dish)
        
    },(err)=>next(err))
    .catch((err)=>console.log(err))
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(resp)
        
    },(err)=>next(err))
    .catch((err)=>console.log(err))
});


dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if (dish != null){
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(dish.comments)
        }
        else{
            err = new Error('Dish '+req.params.dishId+" Not Found")
            err.status = 404
            return next(err)
        }
        
        
    },(err)=>next(err))
    .catch((err)=>console.log(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish != null){
            req.body.author = req.user._id
            dish.comments.push(req.body)
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode = 200
                    res.setHeader('Content-Type','application/json')
                    res.json(dish)
                })
                
            })
            
        }
        else{
            err = new Error('Dish '+req.params.dishId+" Not Found")
            err.status = 404
            return next(err)
        }
    },(err)=>next(err))
    .catch((err)=>console.log(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403
    res.end("PUT Operation not supported on /dishes"+req.params.dishId+"/comments")

})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish != null){
                
            for (var i = (dish.comments.length - 1);i>=0;i--){
                dish.comments.id(dish.comments[i].id).remove()
            }

            dish.save()
            .then((dish)=>{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.json(dish)
            },(err)=>next(err))
            .catch((err)=>console.log(err))
            
        }
        else{
            err = new Error('Dish '+req.params.dishId+" Not Found")
            err.status = 404
            return next(err)
        }
        
    },(err)=>next(err))
    .catch((err)=>console.log(err))

});



dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{

        if (dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(dish.comments.id(req.params.commentId))
        }
        else if (dish == null){
            err = new Error('Dish '+req.params.dishId+" Not Found")
            err.status = 404
            return next(err)
        }
        else{
            err = new Error('Comment '+req.params.commentId+" Not Found")
            err.status = 404
            return next(err)
        }
        
    },(err)=>next(err))
    .catch((err)=>console.log(err))
    

})

.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    
    res.statusCode = 403
    res.end("POST Operation not supported on /dishes/"+req.params.dishId)
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    

    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        
        if (dish.comments.id(req.params.commentId).author.equals(req.user.id)){
            if (dish != null && dish.comments.id(req.params.commentId) != null){
                if (req.body.rating){
                    dish.comments.id(req.params.commentId).rating = req.body.rating
                }
    
                if(req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment
                }
                dish.save()
                .then((dish)=>{
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode = 200
                        res.setHeader('Content-Type','application/json')
                        res.json(dish)
                    })
                    
                },(err)=>next(err))
                .catch((err)=>console.log(err))
                
            }
            else if (dish == null){
                err = new Error('Dish '+req.params.dishId+" Not Found")
                err.status = 404
                return next(err)
            }
            else{
                err = new Error('Comment '+req.params.commentId+" Not Found")
                err.status = 404
                return next(err)
            }
            
        }
        else{
            err = new Error("You are not authorized to perform this action!")
            err.status = 403
            return next(err)
        }
    },(err)=>next(err))
    .catch((err)=>console.log(err))
        
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish != null && dish.comments.id(req.params.commentId) != null && dish.comments.id(req.params.commentId).author.equals(req.user.id)){
            dish.comments.id(req.params.commentId).remove()

            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode = 200
                    res.setHeader('Content-Type','application/json')
                    res.json(dish)
                })
                
            },(err)=>next(err))
            .catch((err)=>console.log(err))
            
        }
        else if (dish == null){
            err = new Error('Dish '+req.params.dishId+" Not Found")
            err.status = 404
            return next(err)
        }
        else{
            err = new Error('Comment '+req.params.commentId+" Not Found")
            err.status = 404
            return next(err)
        }
        
    },(err)=>next(err))
    .catch((err)=>console.log(err))
});


module.exports = dishRouter;