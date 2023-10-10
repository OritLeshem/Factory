const express = require('express')
const { getAllUsers, getUserById, removeUser, addUser, updateUser } = require('./user.controller')

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.delete('/:id', removeUser)
router.post('/', addUser)
router.put('/:id', updateUser)



module.exports = router