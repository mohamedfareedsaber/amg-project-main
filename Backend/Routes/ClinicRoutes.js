const express = require("express");
const router = express.Router();
const Clinic = require("../module/Clinic"); 
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// Authentication Middleware
const checkAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Access denied. Invalid token.' });
  }
};

const isCenterAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'centerAdmin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Only centerAdmin allowed.' });
  }
};

const isCenterAdminOrUser = (req, res, next) => {
  const { centerId } = req.body; 

  if (req.user && (req.user.role === 'centerAdmin' || req.user.role === 'centerUser')) {
    if (req.user.center && req.user.center.toString() === centerId) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Not authorized for this center.' });
    }
  } else {
    res.status(403).json({ error: 'Access denied. Admin or User only.' });
  }
};

// Route to create a new clinic
router.post("/add", checkAuth, isCenterAdminOrUser, async (req, res) => {
    try {
        const { name, centerId, service } = req.body; 
        const newClinic = new Clinic({ name, center: centerId, service });
        await newClinic.save();
        res.status(201).json({ message: "Clinic created successfully", clinic: newClinic });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Error creating clinic", error: error.message });
    }
});

// Route to get all clinics
router.get("/", checkAuth, async (req, res) => {
    try {
        const clinics = await Clinic.find();
        res.status(200).json(clinics);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Error fetching clinics", error: error.message });
    }
});

// Route to update a clinic by ID
router.put("/:id", checkAuth, isCenterAdminOrUser, async (req, res) => {
    try {
        const { name, service } = req.body;
        const updatedClinic = await Clinic.findByIdAndUpdate(req.params.id, { name, service }, { new: true });
        if (!updatedClinic) {
            return res.status(404).json({ message: "Clinic not found" });
        }
        res.status(200).json({ message: "Clinic updated successfully", clinic: updatedClinic });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Error updating clinic", error: error.message });
    }
});

// Route to delete a clinic by ID
router.delete("/:id", checkAuth, isCenterAdmin, async (req, res) => {
    try {
        const deletedClinic = await Clinic.findByIdAndDelete(req.params.id);
        if (!deletedClinic) {
            return res.status(404).json({ message: "Clinic not found" });
        }
        res.status(200).json({ message: "Clinic deleted successfully" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Error deleting clinic", error: error.message });
    }
});

module.exports = router;
