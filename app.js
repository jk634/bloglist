const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const logger = require('./utils/logger');

logger.info('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
