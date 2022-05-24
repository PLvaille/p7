//logiques de routing pour les utilisateurs (signup / login / get / put / delete)
//import d'express
const express = require('express');
//import du router d'experss
const router = express.Router();
// import du contoller d'utilisateur'
const usersController = require('../controllers/usersController');
//import du middleware verifypw pour verif le model du pw lors du signup
const verifPassword = require('../middleware/verifPassword');
//import du middle auth pour l'authentification du l'utilisateur
const auth = require('../middleware/auth');
//import de multer pour les images
const multer = require('../middleware/multer-config');

//router pour les utilisateur

//sign up, route POST on verifie le model du pw, puis on passe dans le controller.createNewUser qui vérifiera la validité de l'email
router.post("/signup", multer, verifPassword, usersController.createNewUser);
//http://localhost:3000/api/users/signup

//loggin, route POST on passe dans le controller.login
router.post("/login", usersController.login);
//http://localhost:3000/api/users/login

//recupérer info d'un utilisateur, GET puis middleware AUTH puis usersController .getUserById
router.get("/:id", auth, usersController.getUserById);
//http://localhost:3000/api/users/63

//modifier son profil
router.put("/:id", auth, multer, usersController.modifyUser);
//http://localhost:3000/api/users/63

// //supprimer son profil
router.delete("/:id", auth, usersController.deleteUser);
//http://localhost:3000/api/users/63

module.exports = router;

