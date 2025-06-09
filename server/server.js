const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/timecapsule', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
