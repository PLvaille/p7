//middleware d'authentification des requetes des posts
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
        //on a alors l'id de l'user
        const userId = decodedToken.userId;

        //si admin
        if (userId == 1) {
            req.auth = userId;
            next();
        }
        else {
            //sinon on verifie que l'id de l'user existe
            if (!userId) {
                res.status(403).send('Requête invalide !');
            } else {
                db.query('SELECT user_id FROM users WHERE user_id = ?;', userId, (err, resu) => {
                    if (err) {
                        throw err;
                    }
                    if (resu == undefined || !resu || resu == []) {
                        throw err;
                    }
                    else {
                        req.auth = userId;
                        //si l'id est validé
                        next();
                    }
                });
            }
        }
    } catch (error) {
        //status 401 non autorisé
        //res.status(401).send(`Requête non authentifiée, connectez vous !`);
        if (error.name == 'TokenExpiredError') {
            return res.status(400).json({ message: "Session expirée ! Reconnectez vous." });
        }
        else {
            return res.status(401).send(error.message);
        }
    }
};