require('dotenv').config();

const express = require('express');
const cors = require('cors');

const router = require('./app/router/index');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(router);

app.use((req, res) => {
  res.status(404);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
