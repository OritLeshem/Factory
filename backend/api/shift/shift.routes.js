const express = require('express')
const { getAllShifts, getShiftById,removeShift, addShift,updateShift } = require('./shift.controller')

const router = express.Router()

router.get('/',getAllShifts)
router.get('/:id',getShiftById)
router.delete('/:id',removeShift)
router.post('/',addShift)
router.put('/:id',updateShift)



module.exports = router