const configDb = require('../../config/db')
const ObjectId = require('mongodb').ObjectId

const collectionName = 'shift'

async function query() {
  try {
    const collection = await configDb.getCollection(collectionName)
    const shifts = await collection.find().toArray()
    return shifts
  } catch (err) {
    console.log(err)
  }
}
async function getById(shiftId) {
  try {
      const collection = await configDb.getCollection(collectionName)
      const shift = collection.findOne({ _id: new ObjectId(shiftId) })
      // const shift = await collection.findOne({ firstName: "Haim" });
      return shift
  } catch (err) {
      console.log(`while finding shift ${shiftId}`, err)
      throw err
  }
}

async function removeById(shiftId){
  try{
    const collection =await configDb.getCollection(collectionName)
    await collection.deleteOne({_id: new ObjectId(shiftId)})
    return shiftId
  }catch(err){
    console.log(`cannot remove shift ${shiftId}`)
    throw err
  }

}
async function add(shift){
  try{
    const collection =await configDb.getCollection(collectionName)
    await collection.insertOne(shift)
    return shift
  }catch(err){
    console.log(`could not add shift ${shift._id}`)
    throw err
  }
}

async function update(shift){
  try{
    const shiftToSave={
      date: shift.date,
      startingHour: shift.startingHour,
      endingHour: shift.endingHour
  }
  const collection =await configDb.getCollection(collectionName)
  await collection.updateOne({ _id: new ObjectId(shift._id) }, { $set: shiftToSave })
return shift
  }
  catch(err){
    console.log(`cannot update ${shift._id}`,err)
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
