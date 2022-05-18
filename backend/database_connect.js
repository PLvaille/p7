//import des variable d'environnement
const path = require('path')
require('dotenv').config({ 
   path: path.resolve(__dirname, './.env') 
});

//import de mysql
const mysql = require('mysql');
//const mysql = require('mysql2');

//parametres pour la création d'un connexion à la db
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

//connection à la db
con.connect(function(err) {
  if (err) throw err;
  console.log("Connecté à mysql !");
});

module.exports = con;


