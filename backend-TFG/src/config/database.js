const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Probar la conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error adquiriendo cliente del pool', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error ejecutando consulta de prueba', err.stack);
    }
    console.log('Conexión a Supabase (PostgreSQL) establecida correctamente:', result.rows[0]);
  });
});

module.exports = pool;