const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config(); 

// Importing routes
const ClientRoutes = require('./Routes/ClientRoutes');
const authRoutes = require('./Routes/authRoutes');
const centerRoutes = require('./Routes/CenterRoute');
const ClinicRoutes = require('./Routes/ClinicRoutes'); 
const DoctorRoutes = require('./Routes/DoctorRoutes'); 
const ReportRoutes = require('./Routes/ReportRoutes');

const app = express();

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/new';

// MongoDB connection setup
mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if the connection fails
  });

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api', authRoutes); // Authentication routes
app.use('/api/centers', centerRoutes); // Center routes
app.use('/api/clients', ClientRoutes); // Client routes
app.use('/api/clinics', ClinicRoutes); // Clinic routes
app.use('/api/doctors', DoctorRoutes); // Doctor routes
app.use('/api/reports', ReportRoutes); // Report routes

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err); 
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server



