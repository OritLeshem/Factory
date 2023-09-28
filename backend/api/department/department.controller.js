const departmentService = require('./department.service')
//get All
async function getAllDepartments(req, res) {
  try {
    
    const departments = await departmentService.query()
    res.json(departments)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get departments' })
  }
}
module.exports = { getAllDepartments }
