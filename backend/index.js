const express = require('express')
const cors = require('cors')
const { connect: connectDB } = require('./config/db');
const departmentRouter = require('./api/department/department.routes')
const employeeRouter = require('./api/employee/employee.routes')
const shiftRouter = require('./api/shift/shift.routes')

const app = express()
const PORT = 5001
connectDB();
app.use(cors())
app.use(express.json())
//routes
app.use('/department', departmentRouter)
app.use('/employee', employeeRouter)
app.use('/shift', shiftRouter)


app.listen(PORT, () => {
  console.log(`app is listening on port http://localhost:${PORT}
  `)
})
