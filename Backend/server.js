const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// Importing routes
const ClientRoutes = require('./Routes/ClientRoutes');
const authRoutes = require('./Routes/authRoutes');
const centerRoutes = require('./Routes/CenterRoute');
const ClinicRoutes = require('./Routes/ClinicRoutes'); 
const DoctorRoutes = require('./Routes/DoctorRoutes'); 
const ReportRoutes = require('./Routes/ReportRoutes');

const app = express();
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/new';

// MongoDB connection
mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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
  console.error('Global Error Handler:', err); // Improved error logging
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});
