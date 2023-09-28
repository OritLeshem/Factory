const configDb = require('../../config/db')
const ObjectId = require('mongodb').ObjectId

const collectionName = 'employee'

async function query() {
  try {
    const collection = await configDb.getCollection(collectionName);
    const aggregationPipeline = [
      {
        $lookup: {
          from: 'department',
          let: { departmentId: { $toObjectId: { $ifNull: ["$departmentId", null] } } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$departmentId"] }
              }
            }
          ],
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'shift',
          let: { shiftIds: { $map: { input: "$shifts", as: "id", in: { $toObjectId: { $ifNull: ["$$id", null] } } } } }, // Mapping shifts array to ObjectId array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$shiftIds"] }
              }
            }
          ],
          as: 'shifts'
        }
      }
    ];
    
    // Debug: Log the aggregation pipeline
    // console.log("Aggregation Pipeline:");
    // console.log(JSON.stringify(aggregationPipeline, null, 2));
    
    const employeesWithDepartmentsAndShifts = await collection.aggregate(aggregationPipeline).toArray();
    
    // Debug: Log the result of the aggregation
    // console.log("Aggregation Result:");
    // console.log(JSON.stringify(employeesWithDepartmentsAndShifts, null, 2));
    
    return employeesWithDepartmentsAndShifts;
  } catch (err) {
    console.log("Error during aggregation:", err);
    throw err; 
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
      departmentId: employee.departmentId,
      shifts: employee.shifts
      
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

// async function query() {
//   try {
//     const collection = await configDb.getCollection(collectionName)
//     const employees = await collection.find().toArray()
//     return employees
//   } catch (err) {
//     console.log(err)
//   }
// }

// async function query() {
//   try {
//     const collection = await configDb.getCollection(collectionName);
//     const aggregationPipeline = [
//       {
//         $lookup: {
//           from: 'department',
//           let: { departmentId: { $toObjectId: { $ifNull: ["$departmentId", null] } } },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ["$_id", "$$departmentId"] }
//               }
//             }
//           ],
//           as: 'department'
//         }
//       },
//       {
//         $unwind: {
//           path: '$department',
//           preserveNullAndEmptyArrays: true
//         }
//       }
//     ];
//     const employeesWithDepartments = await collection.aggregate(aggregationPipeline).toArray();
//     return employeesWithDepartments;
//   } catch (err) {
//     console.log(err);
//     throw err; // it is generally better to throw the error so that the caller can handle it appropriately
//   }
// }