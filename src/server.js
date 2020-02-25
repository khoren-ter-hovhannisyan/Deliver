require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const companyRouter = require('./api/routes/companies.routes');

const config = require('./config');

const app = express();

app.use(express.json());
app.use(morgan('combined'));

app.use(companyRouter);

mongoose.connect(config.db.url, { useNewUrlParser: true }, () => {
  app.listen(config.server.port, () => {
    console.log(`Magic is happening on port ${config.server.port}`);
  });
});