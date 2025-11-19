// Utilisation de pg dans une const afin d'appeler
// une nouvelle classe pour définir les infos d'accès de la database

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
client.connect();

module.exports = client;
