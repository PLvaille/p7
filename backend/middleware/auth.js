//middleware d'authentification des requetes des users
//import des variable d'environnement
const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});
//import du package jwt qui ENCODE le token
const jwt = require('jsonwebtoken');
//import de la db
const db = require('../database_connect');

module.exports = (req, res, next) => {
  try {
    //on recup le token de la partie authorization du header de la requete
    const token = req.headers.authorization.split(' ')[1];
    //on décode avec la methode verify et la clé secrète initialisée dans les variable d'environnement
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    //en theorie on a alors l'id de l'user
    const userId = decodedToken.userId;
    const paramsId = req.params.id;

    //verifier que l'user id du token existe en db
    db.query('SELECT user_id FROM users WHERE user_id = ?;', userId, (err, res) => {
      if (err) {
        throw err;
      }
      if (!res || res == undefined || res == []) {
        throw err;
      }
      else {
        //si admin
        if (userId == 1) {
          req.auth = userId;
          next();
        }
        else {
          req.auth = userId;
          //si l'id est validé
          next();
        }
      }
    });

  } catch {
    //status 401 non autorisé
    res.status(401).json({ message: "Requête non authentifiée ou invalide !" });
  }
};