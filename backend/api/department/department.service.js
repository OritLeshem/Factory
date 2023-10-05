const configDb = require('../../config/db')
const ObjectId = require('mongodb').ObjectId

const collectionName = 'department'
// async function query() {
//   try {
//     const collection = await configDb.getCollection(collectionName);

//     // Aggregation pipeline
//     const aggregationPipeline = [
//       {
//         $addFields: {
//           idString: { $toString: "$_id" }
//         }
//       },
//       {
//         $lookup: {
//           from: 'employee',
//           localField: 'idString',
//           foreignField: 'departmentId',
//           as: 'employeeData'
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           departmentManager: 1,
//           departmentName: 1,
//           employees: "$employeeData"
//         }
//       },
//       {
//         $unwind: {
//           path: "$employees",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $group: {
//           _id: "$_id",
//           departmentManager: { $first: "$departmentManager" },
//           departmentName: { $first: "$departmentName" },
//           employees: { $push: "$employees" }
//         }
//       }

//     ];


//     const departmentsWithEmployees = await collection.aggregate(aggregationPipeline).toArray();
//     return departmentsWithEmployees;

//   } catch (err) {
//     console.log("Error during aggregation:", err);
//     throw err;
//   }
// }
// async function query() {
//   try {
//     const collection = await configDb.getCollection(collectionName)
//     const departments = await collection.find().toArray()
//     return departments
//   } catch (err) {
//     console.log(err)
//   }
// }
// async function getById(departmentId) {
//   try {
//     const collection = await configDb.getCollection(collectionName)
//     const department = collection.findOne({ _id: new ObjectId(departmentId) })
//     // const department = await collection.findOne({ firstName: "Haim" });
//     return department
//   } catch (err) {
//     console.log(`while finding department ${departmentId}`, err)
//     throw err
//   }
// }

async function removeById(departmentId) {
  try {
    const collection = await configDb.getCollection(collectionName)
    await collection.deleteOne({ _id: new ObjectId(departmentId) })
    return departmentId
  } catch (err) {
    console.log(`cannot remove department ${departmentId}`)
    throw err
  }

}
async function add(department) {
  try {
    const collection = await configDb.getCollection(collectionName)
    await collection.insertOne(department)
    return department
  } catch (err) {
    console.log(`could not add department ${department.departmentName}`)
    throw err
  }
}

async function update(department) {
  try {
    const departmentToSave = {
      departmentManager: department.departmentManager,
      departmentName: department.departmentName,


    }
    const collection = await configDb.getCollection(collectionName)
    await collection.updateOne({ _id: new ObjectId(department._id) }, { $set: departmentToSave })
    return department
  }
  catch (err) {
    console.log(`cannot update ${department._id}`, err)
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
//     const collection = await configDb.getCollection(collectionName);

//     // Aggregation pipeline
//     const aggregationPipeline = [
//       {
//         $addFields: {
//           idString: { $toString: "$_id" }
//         }
//       },
//       {
//         $lookup: {
//           from: 'employee',
//           localField: 'idString',
//           foreignField: 'departmentId',
//           as: 'employeeData'
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           departmentManager: 1,
//           departmentName: 1,
//           employees: {
//             $map: {
//               input: "$employeeData",
//               as: "employee",
//               in: {
//                 id: "$$employee._id",
//                 firstName: "$$employee.firstName",
//                 lastName: "$$employee.lastName"
//               }
//             }
//           }
//         }
//       },
//       {
//         $unwind: {
//           path: "$employees",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $group: {
//           _id: "$_id",
//           departmentManager: { $first: "$departmentManager" },
//           departmentName: { $first: "$departmentName" },
//           employees: { $push: "$employees" }
//         }
//       }
//     ];

//     const departmentsWithEmployees = await collection.aggregate(aggregationPipeline).toArray();
//     return departmentsWithEmployees;

//   } catch (err) {
//     console.log("Error during aggregation:", err);
//     throw err;
//   }
// }
function createAggregationPipeline(departmentId) {
  const baseAggregation = [
    {
      $addFields: {
        idString: { $toString: "$_id" }
      }
    },
    {
      $lookup: {
        from: 'employee',
        localField: 'idString',
        foreignField: 'departmentId',
        as: 'employeeData'
      }
    },
    {
      $project: {
        _id: 1,
        departmentManager: 1,
        departmentName: 1,
        employees: {
          $map: {
            input: "$employeeData",
            as: "employee",
            in: {
              id: "$$employee._id",
              firstName: "$$employee.firstName",
              lastName: "$$employee.lastName"
            }
          }
        }
      }
    },
    {
      $unwind: {
        path: "$employees",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        departmentManager: { $first: "$departmentManager" },
        departmentName: { $first: "$departmentName" },
        employees: { $push: "$employees" }
      }
    }
  ];

  if (departmentId) {
    // If departmentId is provided, add a $match stage at the beginning of the pipeline
    baseAggregation.unshift({
      $match: { _id: new ObjectId(departmentId) }
    });
  }

  return baseAggregation;
}

async function query() {
  try {
    const collection = await configDb.getCollection(collectionName);
    const departmentsWithEmployees = await collection.aggregate(createAggregationPipeline()).toArray();
    return departmentsWithEmployees;
  } catch (err) {
    console.log("Error during aggregation:", err);
    throw err;
  }
}

async function getById(departmentId) {
  console.log('Department ID:', departmentId);

  try {
    const collection = await configDb.getCollection(collectionName);
    const pipeline = createAggregationPipeline(departmentId);
    console.log('Pipeline:', JSON.stringify(pipeline, null, 2));

    const departmentWithEmployees = await collection.aggregate(createAggregationPipeline(departmentId)).toArray();
    console.log('Aggregation Result:', departmentWithEmployees);

    return departmentWithEmployees[0];
  } catch (err) {
    console.log(`Error while finding department ${departmentId}`, err);
    throw err;
  }
}

