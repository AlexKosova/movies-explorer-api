const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const BodyParser = require('body-parser');
const cors = require('cors');
const errorMiddlware = require('./middlewares/errors');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = [
  'http://movies-explorer.alexk.nomoredomainsrocks.ru',
  'https://movies-explorer.alexk.nomoredomainsrocks.ru',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://localhost:3001',
];

const { PORT = 3001 } = process.env;
const app = express();

app.use(BodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials');
  }

  const { method } = req;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);

    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }

  return next();
});

app.use(requestLogger);
app.use(express.json());

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorMiddlware);

async function connect() {
  await mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');
  app.listen(PORT);
}

connect();
// 'mongodb://127.0.0.1:27017/bitfilmsdb'