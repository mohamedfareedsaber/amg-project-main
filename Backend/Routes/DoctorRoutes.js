const express = require('express');
const router = express.Router();
const Doctor = require('../module/Docter'); 
const Clinic = require('../module/Clinic'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// Authentication Middleware
const checkAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Access denied. Invalid token.' });
  }
};

router.post('/add', checkAuth, async (req, res) => {
  try {
    const { doctorCode, name, nationalId, specialty, password, username, appointmentHours, clinicId } = req.body;

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    const newDoctor = new Doctor({
      doctorCode,
      name,
      nationalId,
      specialty,
      password,
      username,
      appointmentHours, 
      clinic: clinicId, 
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    console.error("Error adding doctor:", error.message);
    res.status(500).json({ message: 'Error adding doctor', error: error.message });
  }
});

// Route for doctor login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;


    const doctor = await Doctor.findOne({ username }).populate('clinic');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (doctor.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: doctor._id, username: doctor.username, role: 'doctor' }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful',
      token, 
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialty,
        clinic: doctor.clinic, 
      },
    });
  } catch (error) {
    console.error("Error logging in doctor:", error.message);
    res.status(500).json({ message: 'Error logging in doctor', error: error.message });
  }
});

module.exports = router;
