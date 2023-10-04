const configDb = require('../../config/db')
const ObjectId = require('mongodb').ObjectId

const collectionName = 'employee'


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
  console.log("service update employee")
  console.log("^^^^^^^^^^^^^^^^^^^^^^^")
  try{ 

    const employeeToSave={
      firstName: employee.firstName,
      lastName: employee.lastName,
      startWorkYear: employee.startWorkYear,
      departmentId: employee.departmentId,
      shifts: employee.shifts
      
  }
  console.log("employeeToSave", employeeToSave)
  console.log("%%%%%%%%%%%%%%%%%%%%%%%")

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
async function query() {
  try {
    const collection = await configDb.getCollection(collectionName);
    const aggregationPipeline = [
      // Convert shifts array strings to ObjectIDs
      {
        $addFields: {
          shifts: {
            $map: {
              input: "$shifts",
              as: "shiftId",
              in: {
                $toObjectId: "$$shiftId"
              }
            }
          },
          departmentId: {
            $cond: {
              if: { $eq: [{ $type: "$departmentId" }, "string"] },
              then: { $toObjectId: "$departmentId" },
              else: "$departmentId" // keep it as is, if it's not a string
            }
          }
        }
      },
      // Join with 'shift'
      {
        $lookup: {
          from: 'shift',
          localField: 'shifts',
          foreignField: '_id',
          as: 'shiftDetails'
        }
      },
      // Join with 'department'
      {
        $lookup: {
          from: 'department',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    const employeesWithDetails = await collection.aggregate(aggregationPipeline).toArray();
    return employeesWithDetails;
  } catch (err) {
    console.log("Error during aggregation:", err);
    throw err;
  }
}



// async function query() {
//   try {
//     const collection = await configDb.getCollection(collectionName);
//     const aggregationPipeline = [
//       // $lookup for department
//       {
//         $lookup: {
//           from: 'department',
//           let: {
//             departmentId: {
//               $cond: {
//                 if: { $eq: [{ $type: "$departmentId" }, "string"] },
//                 then: { $toObjectId: "$departmentId" },
//                 else: "$departmentId" // keep it as is, if it's not a string
//               }
//             }
//           },
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
//       },

//       // $lookup for shifts
//       {
//         $lookup: {
//           from: 'shifts',  // Assuming your shifts collection is named "shifts"
//           localField: 'shifts',
//           foreignField: '_id',
//           as: 'shiftsDetails' // New array for detailed shifts info
//         }
//       },

//       // Unwind shiftsDetails and then group them back 
//       {
//         $unwind: {
//           path: '$shiftsDetails',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $group: {
//           _id: '$_id', // Group by the original document ID
//           firstName: { $first: '$firstName' },
//           lastName: { $first: '$lastName' },
//           startWorkYear: { $first: '$startWorkYear' },
//           departmentId: { $first: '$departmentId' },
//           department: { $first: '$department' },
//           shifts: { $first: '$shifts' },
//           shiftsDetails: { $push: '$shiftsDetails' }
//         }
//       }
//     ];

//     const employeesWithDetails = await collection.aggregate(aggregationPipeline).toArray();
//     return employeesWithDetails;
//   } catch (err) {
//     console.log("Error during aggregation:", err);
//     throw err;
//   }
// }

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
//           let: {
//             departmentId: {
//               $cond: {
//                 if: { $eq: [{ $type: "$departmentId" }, "string"] },
//                 then: { $toObjectId: "$departmentId" },
//                 else: "$departmentId" // keep it as is, if it's not a string
//               }
//             }
//           },
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
//     console.log("Error during aggregation:", err);
//     throw err;
//   }
// }



// async function query() {
//   try {
//     const collection = await configDb.getCollection(collectionName);
    
//     const aggregationPipeline = [
//       {
//                 $lookup: {
//                   from: 'shift',
//                   let: { shiftIds: { $map: { input: "$shifts", as: "shift", in: { $toObjectId: "$$shift" } } } },
//                   pipeline: [
//                     {
//                       $match: {
//                         $expr: {
//                           $in: ["$_id", "$$shiftIds"]
//                         }
//                       }
//                     }
//                   ],
//                   as: 'shifts'
//                 }
//               },
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

//     const employeesWithDetails = await collection.aggregate(aggregationPipeline).toArray();
//     return employeesWithDetails;
//   } catch (err) {
//     console.log("Error during aggregation:", err);
//     throw err;
//   }
// }
