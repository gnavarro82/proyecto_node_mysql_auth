const mysql = require('mysql');
const { promisify }= require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);//Se pasa la configuracion de key.js

pool.getConnection((err, connection) => {
//si hay algun error
    if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('La base de datos tiene muchas conexiones.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Se rechazó la conexión a la base de datos');
    }
  }

  //si no hay error usamos la conection
  if (connection) connection.release();
  console.log('La DB esta Connectada');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;