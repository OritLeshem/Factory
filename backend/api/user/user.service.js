const configDb = require('../../config/db')
const ObjectId = require('mongodb').ObjectId

const collectionName = 'user'

async function query() {
  try {
    const collection = await configDb.getCollection(collectionName)
    const users = await collection.find().toArray()
    return users
  } catch (err) {
    console.log(err)
  }
}
async function getById(userId) {
  try {
    const collection = await configDb.getCollection(collectionName)
    const user = collection.findOne({ _id: new ObjectId(userId) })
    // const user = await collection.findOne({ firstName: "Haim" });
    return user
  } catch (err) {
    console.log(`while finding user ${userId}`, err)
    throw err
  }
}

async function removeById(userId) {
  try {
    const collection = await configDb.getCollection(collectionName)
    await collection.deleteOne({ _id: new ObjectId(userId) })
    return userId
  } catch (err) {
    console.log(`cannot remove user ${userId}`)
    throw err
  }

}
async function add(user) {
  try {
    const collection = await configDb.getCollection(collectionName)
    await collection.insertOne(user)
    return user
  } catch (err) {
    console.log(`could not add user ${user._id}`)
    throw err
  }
}

async function update(user) {
  try {
    const userToSave = {
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password
    }
    const collection = await configDb.getCollection(collectionName)
    await collection.updateOne({ _id: new ObjectId(user._id) }, { $set: userToSave })
    return user
  }
  catch (err) {
    console.log(`cannot update ${user._id}`, err)
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
