// // import des variables d'environnement
// require("dotenv").config();
// dotenv.config();

// //import de mysql
// const mysql = require('mysql');
// //const mysql = require('mysql2');

// //creation de la pool
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
// });

// // //fonction sql 
// // let sql = "SELECT * FROM users;";

// // //on execute la fonction sql
// // pool.query(sql, function(err, res){
// //     if(err) { throw err }
// //     else { 
// //         res.forEach(e => {
// //             console.log(e.nom);
// //              console.log(e.date);
            
// //         });
// //     }
// // });

// pool.query("SELECT * FROM posts;", function(err, res){
//     if(err) { throw err }
//     else { console.log(res) }
// });

// module.exports = pool.promise();
