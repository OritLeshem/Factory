const express = require('express')
const cors = require('cors')
const { connect: connectDB } = require('./config/db');
const departmentRouter = require('./api/department/department.routes')
const app = express()
const PORT = 5001
connectDB();
app.use(cors())
app.use(express.json())
//routes
app.use('/department', departmentRouter)
app.listen(PORT, () => {
  console.log(`app is listening on port http://localhost:${PORT}
  `)
})
