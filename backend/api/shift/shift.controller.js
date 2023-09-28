const shiftService = require('./shift.service')
//get All
async function getAllShifts(req,res) {
  try {
    const shifts = await shiftService.query()
    res.json(shifts)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get shifts' })

  }

}
async function getShiftById(req, res) {
  try {
    const shiftId = req.params.id; // Getting ID from URL parameter
    const shift = await shiftService.getById(shiftId);
    res.json(shift);
  } catch (err) {
    res.status(500).send({ err: `Failed to get shift ${shiftId}` });
  }
}



async function removeShift(req,res){
  try{
const shiftId= req.params.id
const removedShift= await shiftService.removeById(shiftId)
res.json(`removed shift ${removedShift}` )
}catch(err){
console.log('cannot remove shift',req.params.id)
res.status(500).send({ err: 'Failed to remove shift' })
  }
} 
async function addShift(req,res){
  try{
    const shift=req.body
    console.log("shift body",shift)
    const addedShift=await shiftService.add(shift)
    res.json(`added shift ${shift._id}`)
  }
  catch(err){
    console.log(`could not add shift `)
    res.status(500).send({ err: 'Failed to add shift' })

  }
}

async function updateShift(req, res) {
  try {
    const shift = req.body
    console.log("constroller body",shift)
    const updatedShift = await shiftService.update(shift)
    res.json('updatedShift')
  } catch (err) {
    logger.error('Failed to update shift', err)
    res.status(500).send({ err: 'Failed to update shift' })

  }
}
module.exports = { 
  getAllShifts,
  getShiftById,
  removeShift,
  addShift,
  updateShift
}