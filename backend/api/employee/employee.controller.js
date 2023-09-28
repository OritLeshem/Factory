const employeeService = require('./employee.service')
//get All
async function getAllEmployees(req,res) {
  try {
    const employees = await employeeService.query()
    res.json(employees)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get employees' })

  }

}
async function getEmployeeById(req, res) {
  try {
    const employeeId = req.params.id;
    console.log(employeeId) // Getting ID from URL parameter
    const employee = await employeeService.getById(employeeId);
    res.json(employee);
  } catch (err) {
    res.status(500).send({ err: `Failed to get employee ${employeeId}` });
  }
}



async function removeEmployee(req,res){
  try{
const employeeId= req.params.id
const removedEmployee= await employeeService.removeById(employeeId)
res.json(`removed employee ${removedEmployee}` )
}catch(err){
console.log('cannot remove employee',req.params.id)
res.status(500).send({ err: 'Failed to remove employee' })
  }
} 
async function addEmployee(req,res){
  try{
    const employee=req.body
    console.log("employee body",employee)
    const addedEmployee=await employeeService.add(employee)
    res.json(`added employee ${employee.firstName}`)
  }
  catch(err){
    console.log(`could not add employee `)
    res.status(500).send({ err: 'Failed to add employee' })

  }
}

async function updateEmployee(req, res) {
  console.log("update controller employee", req.params.id)
  try {
    const employee = req.body
    console.log("constroller body",employee)
    const updatedEmployee = await employeeService.update(employee)
    res.json('updatedEmployee')
  } catch (err) {
    logger.error('Failed to update employee', err)
    res.status(500).send({ err: 'Failed to update employee' })

  }
}
module.exports = { 
  getAllEmployees,
  getEmployeeById,
  removeEmployee,
  addEmployee,
  updateEmployee
}