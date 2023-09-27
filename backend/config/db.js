const MongoClient = require('mongodb').MongoClient


module.exports = {
    getCollection,
    connect
}

var dbConn = null

async function getCollection(collectionName) {
  try {
      const db = await connect()
      const collection = await db.collection(collectionName) // using the parameter
      console.log('Successfully connected to collection:', collection.s.namespace.collection);
      return collection
  } catch (err) {
      console.error('Failed to get Mongo collection', err) // changed logger.error to console.error as logger is not defined in your snippet
      throw err
  }
}


async function connect() {
  if (dbConn) return dbConn;
  try {
      console.log('Trying to connect to MongoDB...');
      const client = await MongoClient.connect('mongodb+srv://admin:1234@cluster0.g0ltrni.mongodb.net/');
      const db = client.db('factory');
      dbConn = db;
      console.log('Successfully connected to factoryDB');
      return db;
  } catch (err) {
      console.error('Error connecting to MongoDB', err);
      throw err;
  }
}