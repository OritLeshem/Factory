const departmentService = require('./department.service')
//get All
async function getAllDepartments(req,res) {
  try {
    const departments = await departmentService.query()
    res.json(departments)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get departments' })

  }

}
async function getDepartmentById(req, res) {
  try {
    const departmentId = req.params.id; // Getting ID from URL parameter
    const department = await departmentService.getById(departmentId);
    res.json(department);
  } catch (err) {
    res.status(500).send({ err: `Failed to get department ${departmentId}` });
  }
}



async function removeDepartment(req,res){
  try{
const departmentId= req.params.id
const removedDepartment= await departmentService.removeById(departmentId)
res.json(`removed department ${removedDepartment}` )
}catch(err){
console.log('cannot remove department',req.params.id)
res.status(500).send({ err: 'Failed to remove department' })
  }
} 
async function addDepartment(req,res){
  try{
    const department=req.body
    console.log("department body",department)
    const addedDepartment=await departmentService.add(department)
    res.json(`added department ${department.name}`)
  }
  catch(err){
    console.log(`could not add department `)
    res.status(500).send({ err: 'Failed to add department' })

  }
}

async function updateDepartment(req, res) {
  try {
    const department = req.body
    console.log("constroller body",department)
    const updatedDepartment = await departmentService.update(department)
    res.json('updatedDepartment')
  } catch (err) {
    logger.error('Failed to update department', err)
    res.status(500).send({ err: 'Failed to update department' })

  }
}
module.exports = { 
  getAllDepartments,
  getDepartmentById,
  removeDepartment,
  addDepartment,
  updateDepartment
}