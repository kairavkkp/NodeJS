const MongoClient = require("mongodb").MongoClient
const assert = require("assert")
const dboper = require("./operations")
const url = 'mongodb://localhost:27017/'
const dbname = 'conFusion'

MongoClient.connect(url)
.then((err,client) => {
    
    console.log('error inside', err)
    console.log('client inside', client)
    assert.equal(err,null);
    console.log('Connected Correctly to server');

    const db = client.db(dbname);
    
    dboper.insertDocument(db,{name:"Dominos",description:"Pizza"},'dishes')
    .then((result)=>{
        console.log("Insert Document:\n",result.ops);

        return dboper.findDocuments(db,'dishes')
    })
    .then((docs)=>{
        console.log("Found Documents:\n",docs);

        return dboper.updateDocument(db,{name:"Dominos"},{description:"Pizzas"},'dishes')
    })
    .then((result)=>{
        console.log("Updated Document:\n",result.result);

        return dboper.findDocuments(db,'dishes')
    })
    .then((docs)=>{

        console.log("Found Documents:\n",docs)

        return db.dropCollection('dishes')
    })
    .then((result)=>{
                    console.log("Dropped collection:\n",result);
                    client.close()
    })
    .catch((err)=>console.log(err));

})
.catch((err)=> console.log('final catch', err));