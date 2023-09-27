 const ConfigDb=require('../../config/db')
const collectionName='department'
 async function query(){
  try{
    const collection =await ConfigDb.getCollection(collectionName)
    let departments=await collection.find().toArray()
    return departments
  }catch(err){
    console.log(err)
  }
 }
 module.exports = {
  query
 }