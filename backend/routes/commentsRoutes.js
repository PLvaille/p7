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

//commenter un commentaire sur un post
router.post("/:postId", auth, multer, commentsController.comment);
//http://localhost:3000/api/posts/comment/29

// //modifier un commentaire
router.put("/:postId/:id", auth, multer, commentsController.modifyComment);
//http://localhost:3000/api/posts/comment/24/11

// //supprimer un commentaire
router.delete("/:postId/:id", auth, multer, commentsController.deleteComment);
//http://localhost:3000/api/posts/comment/29/13

// //ajouter/supprimer un like
router.post("/:postId/likes", auth, multer, commentsController.addLike);
// http://localhost:3000/api/posts/comment/29/like

router.get("/:postId/likes", auth, multer, commentsController.getLikes)

module.exports = router;

