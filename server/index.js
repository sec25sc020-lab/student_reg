require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || 5000

const registrationSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  rollNo: { type: String, required: true, unique: true, trim: true, lowercase: true },
  dob: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  address: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  department: { type: String, required: true },
  course: { type: String, required: true },
  gender: { type: String, required: true },
  year: { type: String, required: true },
  section: { type: String, required: true },
  backlogs: { type: Number, required: true, min: 0 },
  companies: { type: [String], default: [] }
}, { timestamps: true })

const Registration = mongoose.model('Registration', registrationSchema)

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running'
  })
})

app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 }).lean()
    res.json(registrations)
  } catch (error) {
    res.status(500).json({ message: 'Could not load registrations.' })
  }
})

app.post('/api/registrations', async (req, res) => {
  try {
    const registration = await Registration.create(req.body)
    res.status(201).json(registration)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'That roll number is already registered.' })
    }
    res.status(400).json({ message: 'Could not save registration.', details: error.message })
  }
})

async function startServer() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected')
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

startServer().catch((error) => {
  console.error('MongoDB connection failed:', error.message)
  process.exit(1)
})
