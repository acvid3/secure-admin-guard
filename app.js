
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const pageRoutes = require('./routes/pageRoutes');
const logger = require('./config/logger');

const app = express();

mongoose.connect(process.env.MONGO_URI);
app.use(express.json());

app.use('/css', express.static(path.join(__dirname, 'contents/css')));
app.use('/js', express.static(path.join(__dirname, 'contents/js')));
app.use('/images', express.static(path.join(__dirname, 'contents/images')));

app.set('views', path.join(__dirname, 'contents/views'));
app.set('view engine', 'ejs');

app.use('/', pageRoutes);

app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  logger.error(err.message, err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});
