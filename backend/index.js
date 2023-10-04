const express = require('express')
const cors = require('cors')
const { connect: connectDB } = require('./config/db');
const departmentRouter = require('./api/department/department.routes')
const employeeRouter = require('./api/employee/employee.routes')
const shiftRouter = require('./api/shift/shift.routes')

const app = express()
const PORT = 5001
connectDB();

// CORS configuration
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {  // !origin allows browsers to handle local files or without origin headers
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(express.json())

//routes
app.use('/department', departmentRouter)
app.use('/employee', employeeRouter)
app.use('/shift', shiftRouter)

app.listen(PORT, () => {
  console.log(`app is listening on port http://localhost:${PORT}`)
})
