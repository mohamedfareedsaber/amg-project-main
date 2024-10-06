const express = require('express');
const router = express.Router();
const Client = require('../module/Client');
const { cloudinary, storage } = require('../config/Cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// Authentication Middleware
const checkAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Access denied. Invalid token.' });
  }
};

// Middleware to check if the user is a center admin or user
const isCenterAdminOrUser = (req, res, next) => {
  if (req.user && (req.user.role === 'centerAdmin' || req.user.role === 'centerUser')) {
    return next();
  } else {
    return res.status(403).json({ error: 'Access denied. Admin or User only.' });
  }
};

// Validate uploaded photo
const validatePhoto = (req, res, next) => {
  if (req.file) {
    if (req.file.size > 1000000) { // 1MB limit
      return res.status(400).json({ error: 'Photo size exceeds 1MB limit.' });
    }
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Invalid photo format. Only images allowed.' });
    }
  }
  next();
};

// Create a new client with optional photo upload
router.post('/', upload.single('photo'), validatePhoto, async (req, res) => {
  try {
    const { center, ...rest } = req.body;

    if (!center) {
      return res.status(400).json({ error: "Center is required" });
    }

    const clientData = { center, ...rest }; // Use destructuring for clarity
    
    if (req.file) {
      clientData.photo = req.file.path; // Save photo path if uploaded
    }

    const newClient = new Client(clientData);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a client
router.put('/:id',  async (req, res) => {
  try {
    const clientId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }

    const existingClient = await Client.findById(clientId);
    
    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Update fields as necessary
    const updatedClientData = { ...req.body }; // Use spread operator
    const updatedClient = await Client.findByIdAndUpdate(clientId, updatedClientData, { new: true }); // Return the updated document

    return res.status(200).json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return res.status(500).json({ error: 'Failed to update client: ' + error.message });
  }
});

// Get fit/unfit status for all clients
router.get('/fit-status', async (req, res) => {
  try {
    const allClients = await Client.find();
    const fitClients = allClients.filter(client => client.fit === true);
    const unfitClients = allClients.filter(client => client.fit === false); 

    res.json({
      fit: fitClients.length,
      unfit: unfitClients.length,
    });
  } catch (error) {
    console.error('Error fetching clients by fit status:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get clients for a center
// Get clients for a center
router.get('/',  async (req, res) => {
  try {
    console.log('Authenticated User:', req.user); 

    const user = req.user; 

    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const centerId = user.center; 
    if (!centerId) {
      return res.status(400).json({ error: 'User does not belong to a center' });
    }

    const clients = await Client.find({ center: centerId });
    return res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

module.exports = router;

