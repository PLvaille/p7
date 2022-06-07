//les logiques de routing pour les commentaires
//appel d'express et de sa methode Router()
const express = require('express');
const router = express.Router();
//middleware d'authentification
const auth = require('../middleware/auth');
//midleware multer pour la gestion d'image
const multer = require('../middleware/multer-config');

//controleur des routes comment
const commentsController = require('../controllers/commentsController');

//obtenir les commentaires d'un post 
router.get("/:postId", auth, multer, commentsController.getComments);
//http://localhost:3000/api/comment/:postid

//commenter un commentaire sur un post
router.post("/:postId", auth, multer, commentsController.comment);
//http://localhost:3000/api/comment/:postid

// //modifier un commentaire
router.put("/:id", auth, multer, commentsController.modifyComment);
//http://localhost:3000/api/comment/:id/

// //supprimer un commentaire
router.delete("/:id", auth, multer, commentsController.deleteComment);
//http://localhost:3000/api/comment/:id

// //ajouter/supprimer un like
router.post("/:postId/likes", auth, multer, commentsController.addLike);
// http://localhost:3000/api/comment/:postid/likes

router.get("/:postId/likes", auth, multer, commentsController.getLikes)
// http://localhost:3000/api/comment/:postid/likes

module.exports = router;

