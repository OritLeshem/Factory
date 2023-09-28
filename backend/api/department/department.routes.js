const express = require('express')
const { getAllDepartments, getDepartmentById,removeDepartment, addDepartment,updateDepartment } = require('./department.controller')

const router = express.Router()

router.get('/',getAllDepartments)
router.get('/:id',getDepartmentById)
router.delete('/:id',removeDepartment)
router.post('/',addDepartment)
router.put('/:id',updateDepartment)



module.exports = router