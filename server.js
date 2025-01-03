const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'your_mongodb_connection_string_here';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Endpoint to add a new user
app.post('/add', async (req, res) => {
  const { name, email, publicKey } = req.body;

  if (!name || !email || !publicKey) {
    return res.status(400).json({ error: 'Name, email, and public key are required.' });
  }

  try {
    const newUser = new User({ name, email, publicKey });
    await newUser.save();
    res.status(201).json({ message: 'User added successfully.' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'Email already exists.' });
    } else {
      res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
  }
});

// Endpoint to get a user's public key by email
app.get('/public-key', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ publicKey: user.publicKey });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the public key.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
