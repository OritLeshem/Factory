const userService = require('./user.service')
//get All
async function getAllUsers(req, res) {
  try {
    const users = await userService.query()
    res.json(users)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get users' })

  }

}
async function getUserById(req, res) {
  try {
    const userId = req.params.id; // Getting ID from URL parameter
    const user = await userService.getById(userId);
    res.json(user);
  } catch (err) {
    res.status(500).send({ err: `Failed to get user ${userId}` });
  }
}



async function removeUser(req, res) {
  try {
    const userId = req.params.id
    const removedUser = await userService.removeById(userId)
    res.json(`removed user ${removedUser}`)
  } catch (err) {
    console.log('cannot remove user', req.params.id)
    res.status(500).send({ err: 'Failed to remove user' })
  }
}
async function addUser(req, res) {
  try {
    const user = req.body
    console.log("user body", user)
    const addedUser = await userService.add(user)
    res.json(`added user ${user._id}`)
  }
  catch (err) {
    console.log(`could not add user `)
    res.status(500).send({ err: 'Failed to add user' })

  }
}

async function updateUser(req, res) {
  try {
    const user = req.body
    console.log("constroller body", user)
    const updatedUser = await userService.update(user)
    res.json('updatedUser')
  } catch (err) {
    logger.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })

  }
}
module.exports = {
  getAllUsers,
  getUserById,
  removeUser,
  addUser,
  updateUser
}