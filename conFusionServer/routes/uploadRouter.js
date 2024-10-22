const express = require("express")
const bodyParser = require("body-parser")
const authenticate = require('../authenticate')
const multer = require('multer')
const cors = require('./cors')
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images');

    },

    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});

const imageFileFilter = (req,file,cb) =>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files.'),false)
    }

    else{
        cb(null,true)
    }
}

const upload = multer({storage:storage,fileFilter:imageFileFilter})


const uploadRouter = express.Router()

uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus=200})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile'),(req,res)=>{
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.json(req.file)
})

.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403
    res.end("GET Operation not supported on /imageUpload")

})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403
    res.end("PUT Operation not supported on /imageUpload")

})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403
    res.end("DELETE Operation not supported on /imageUpload")

})



module.exports = uploadRouter;