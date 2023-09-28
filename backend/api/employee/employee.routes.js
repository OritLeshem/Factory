const express = require('express')
const { getAllEmployees, getEmployeeById,removeEmployee, addEmployee,updateEmployee } = require('./employee.controller')

const router = express.Router()

router.get('/',getAllEmployees)
router.get('/:id',getEmployeeById)
router.delete('/:id',removeEmployee)
router.post('/',addEmployee)
router.put('/:id',updateEmployee)



module.exports = router