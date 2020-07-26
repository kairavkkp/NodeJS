const mongoose = require("mongoose")

const Dishes = require('./models/dishes')

const url = "mongodb://localhost:27017/conFusion"

const connect = mongoose.connect(url)

connect.then((db)=> {
    console.log("Connected Correctly to server")

    Dishes.create({
        name:"Pizza Hut",
        description:"Pan Pizzas"

    })
    
    .then((dish)=>{
        console.log(dish)
        return Dishes.findByIdAndUpdate(dish._id,{
            $set:{ description: "Updated Text"}
        },{
            new:true
        }).exec();
    })
    .then((dish)=>{
        console.log(dish)

        dish.comments.push({
            rating:5,
            comment:"I\'m having time of my life.",
            author:"KKP"
        })

        return dish.save()
    })
    .then((dish)=>{
        console.log(dish)
        return Dishes.deleteMany({})
    })
    .then(()=>{
        return mongoose.connection.close()
    })
    .catch((err)=>{
        console.log(err)
    });


}).catch((err)=>console.log(err))