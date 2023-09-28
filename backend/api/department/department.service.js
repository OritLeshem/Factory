const configDb = require('../../config/db')
const ObjectId = require('mongodb').ObjectId

const collectionName = 'department'

async function query() {
  try {
    const collection = await configDb.getCollection(collectionName)
    const departments = await collection.find().toArray()
    return departments
  } catch (err) {
    console.log(err)
  }
}
async function getById(departmentId) {
  try {
      const collection = await configDb.getCollection(collectionName)
      const department = collection.findOne({ _id: new ObjectId(departmentId) })
      // const department = await collection.findOne({ firstName: "Haim" });
      return department
  } catch (err) {
      console.log(`while finding department ${departmentId}`, err)
      throw err
  }
}

async function removeById(departmentId){
  try{
    const collection =await configDb.getCollection(collectionName)
    await collection.deleteOne({_id: new ObjectId(departmentId)})
    return departmentId
  }catch(err){
    console.log(`cannot remove department ${departmentId}`)
    throw err
  }

}
async function add(department){
  try{
    const collection =await configDb.getCollection(collectionName)
    await collection.insertOne(department)
    return department
  }catch(err){
    console.log(`could not add department ${department}`)
    throw err
  }
}

async function update(department){
  try{
    const departmentToSave={
      departmentManager: department.departmentManager,
      departmentName: department.departmentName,
      
      
  }
  const collection =await configDb.getCollection(collectionName)
  await collection.updateOne({ _id: new ObjectId(department._id) }, { $set: departmentToSave })
return department
  }
  catch(err){
    console.log(`cannot update ${department._id}`,err)
    throw err
  }
}

module.exports = {
  query,
  getById,
  removeById,
  add,
  update
}
// [
//   {
//       "_id": "6513827bb38f9013ca48e084",
//       "departmentManager": "Yael",
//       "departmentName": "Avi"
//   },
//   {
//       "_id": "65138ff3b38f9013ca48e085",
//       "departmentManager": "Sam",
//       "departmentName": "Dana"
//   }
// ]