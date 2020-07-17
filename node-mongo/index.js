const MongoClient = require("mongodb").MongoClient
const assert = require("assert")
const dboper = require("./operations")
const url = 'mongodb://localhost:27017'
const dbname = 'conFusion'

MongoClient.connect(url,(err,client) => {
    
    assert.equal(err,null)

    console.log('Connected Correctly to server')

    const db = client.db(dbname)

    dboper.insertDocument(db,{name:"Dominos",description:"Pizza"},'dishes',(result)=>{
        console.log("Insert Document:\n",result.ops)

        dboper.findDocuments(db,'dishes',(docs)=>{
            console.log("Found Documents:\n",docs)

            dboper.updateDocument(db,{name:"Dominos"},{description:"Pizzas"},'dishes',(result)=>{
                console.log("Updated Document:\n",result.result)


                db.dropCollection('dishes',(result)=>{
                    console.log("Dropped collection:\n",result)
                })
            })
        })
    })
    


})