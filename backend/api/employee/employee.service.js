const configDb = require('../../config/db')
const ObjectId = require('mongodb').ObjectId

const collectionName = 'employee'

async function query() {
  try {
    const collection = await configDb.getCollection(collectionName)
    const employees = await collection.find().toArray()
    return employees
  } catch (err) {
    console.log(err)
  }
}
async function getById(employeeId) {
  try {
      const collection = await configDb.getCollection(collectionName)
      const employee = collection.findOne({ _id: new ObjectId(employeeId) })
      // const employee = await collection.findOne({ firstName: "Haim" });
      return employee
  } catch (err) {
      console.log(`while finding employee ${employeeId}`, err)
      throw err
  }
}

async function removeById(employeeId){
  try{
    const collection =await configDb.getCollection(collectionName)
    await collection.deleteOne({_id: new ObjectId(employeeId)})
    return employeeId
  }catch(err){
    console.log(`cannot remove employee ${employeeId}`)
    throw err
  }

}
async function add(employee){
  try{
    const collection =await configDb.getCollection(collectionName)
    await collection.insertOne(employee)
    return employee
  }catch(err){
    console.log(`could not add employee ${employee}`)
    throw err
  }
}

async function update(employee){
  try{
    const employeeToSave={
      firstName: employee.firstName,
      lastName: employee.lastName,
      startWorkYear: employee.startWorkYear,
      departmentId: employee.departmentId
      
  }
  const collection =await configDb.getCollection(collectionName)
  await collection.updateOne({ _id: new ObjectId(employee._id) }, { $set: employeeToSave })
return employee
  }
  catch(err){
    console.log(`cannot update ${employee._id}`,err)
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
  // {
  //     "_id": "6514b21bbc38a86b96720f31",
  //     "firstName": "John",
  //     "lastName": "Dell",
  //     "startWorkYear": "2009-01-01T00:00:00.000Z",
  //     "departmentId": "1"
  // },
  // {
  //     "_id": "6514c7afbc38a86b96720f32",
  //     "firstName": "Haim",
  //     "lastName": "Cohen",
  //     "startWorkYear": "2009-01-01T00:00:00.000Z",
  //     "departmentId": "1"
  // },
//   {
//       "_id": "6514cf49bc38a86b96720f34",
//       "firstName": "Yael",
//       "lastName": "Jack",
//       "startWorkYear": "2009-01-01T00:00:00.000Z",
//       "departmentId": "1"
//   },
//   {
//       "_id": "6514cf61bc38a86b96720f35",
//       "firstName": "Ruv",
//       "lastName": "Le",
//       "startWorkYear": "2009-01-01T00:00:00.000Z",
//       "departmentId": "1"
//   }
// ]