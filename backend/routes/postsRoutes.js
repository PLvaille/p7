//les logiques de routing pour Posts
//appel d'express et de sa methode Router()
const express = require('express');
const router = express.Router();
//middleware d'authentification pour sécuriser les routes post
const auth = require('../middleware/auth');
//midleware multer pour la gestion d'image
const multer = require('../middleware/multer-config');
//controleur des routes posts
const postsController = require('../controllers/postsController');

//créer un post 
router.post("/", auth, multer, postsController.createPost);
//http://localhost:3000/api/posts/

//récuprer les (derniers) posts
router.get("/", auth, multer, postsController.getAllPosts);
//http://localhost:3000/api/posts/

//récuprérer un post par son id
router.get("/:id", auth, postsController.getPostById);
//http://localhost:3000/api/posts/29

//modifier un post
router.put("/:id", auth, multer, postsController.modifyPost);
//http://localhost:3000/api/posts/29

// //supprimer un post
router.delete("/:id", auth, postsController.deletePost);
//http://localhost:3000/api/posts/29


module.exports = router;