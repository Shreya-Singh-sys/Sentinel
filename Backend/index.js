require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('./src/config/firebase-admin'); // We will create this next

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Crisis Response Backend is Running...');
});

// Import Routes (Inhe hum next step mein banayenge)
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);
const adminRoutes = require('./src/routes/adminRoutes');
app.use("/api", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is moving on port ${PORT}`);
});