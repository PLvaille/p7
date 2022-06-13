//ce fichier défini les fonctions de l'API
//import des élements nécessaires
//l'app utilise le framework express, basé sur node.js, qui a besoin d'un 'parser' afin qu'on manipule du json
const express = require('express');
const app = express();
app.use(express.json());

// //connexion à la DB
const db = require('./database_connect');

//chemin du systeme de fichier
const path = require('path');

//déclaration des routes
const postsRoutes = require('./routes/postsRoutes');        //pour les posts
const usersRoutes = require('./routes/usersRoutes');        //pour les users
const commentsRoutes = require('./routes/commentsRoutes');  //pour les commentaires et likes

//1er middleware qui va créer des en-tetes valides pour les requetes http afin d'éviter des erreurs CORS/CORP
app.use((req, res, next) => {
    //* : tout le monde peut acceder à l'API
    res.setHeader('Access-Control-Allow-Origin', '*');
    //quels en-tetes sont acceptés
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //quelles méthodes sont acceptés
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //quels scripts sont acceptés
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    // paramétre à rajouter pour débloquer les images
    //Cross-Origin-Resource-Policy: same-site | same-origin | cross-origin
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next();
});

//la route statique des images 
app.use('/images', express.static(path.join(__dirname, 'images')));

//routage de l'api
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/comment', commentsRoutes);

//gestion des exceptions de multer
const multer = require('multer');
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(413).json({message : 'Le fichier est trop volumineux !'});
    } else {
        //return res.status(500).send('Une erreure est survenue !');
        return res.status(500).send(err);
    }
});

//export de l'app
module.exports = app;
