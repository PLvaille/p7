//import de la db
const db = require('../database_connect');
//import du schema de post avec joi
const postSchema = require('../models/post');
//import de filesystem
const fs = require('fs');

//fonction pour fs.unlink les images
function deleteImg(file) {
    if (file) {
        fs.unlinkSync(`images/${file.filename}`)
    }
}

//route pour récupérer les (derniers) posts
exports.getAllPosts = async (req, res) => {
// incomplet/abandonné : lazy load, LIMIT 10 avec index*n et n=10 (index commence à 0)
// faire en 1 seule requete posts + commentaires + likes ?
//    var offset = req.params.page;
//    if(offset > 0){
//    offset *= 10;
//    }
//SELECT * FROM posts 
//LEFT JOIN comments ON (posts.post_id = comments.commented_post_id) 
//LEFT JOIN likes ON (like_post_id = posts.post_id)
//ORDER BY post_date DESC 
//LIMIT 10 OFFSET ? , parseInt(offset);

    db.query(`SELECT * FROM posts 
    ORDER BY post_date DESC ;`, (err, resultat) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        else {
            //edition de la date
            resultat.forEach(e => {
                const postDateEdit = JSON.stringify(e.post_date).slice(0, 21).replace('T', ' à ').replace('"', 'le ');
               // const commentDateEdit = JSON.stringify(e.comment_date).slice(0, 21).replace('T', ' à ').replace('"', 'le ');
                e.post_date = postDateEdit;
              //  e.comment_date = commentDateEdit;
            });
            return res.status(200).json(resultat);
            //tableau d'objets
        }
    });
};

//route pour récupérer un post ses commentaires et likes avec son id
exports.getPostById = async (req, res) => {
    let id = req.params.id;
    db.query(`SELECT * FROM posts
    LEFT JOIN comments ON (posts.post_id = comments.commented_post_id)
    LEFT JOIN likes ON (like_post_id = posts.post_id)
    WHERE post_id = ?
    ORDER BY post_date ASC;`,
        id, (err, resultat) => {
            if (err) {
                return res.status(400).json({ message: err });
            }
            else if (!resultat[0]) {
                return res.status(404).json({ message: "Post inexistant" })
            }
            else {
                return res.status(200).json(resultat);
            }
        });
};

// route pour créer un post
exports.createPost = async (req, res) => {
    let image = "";
    const userId = req.auth;
    const post = {
        post_author_id: userId,
        post_title: req.body.post_title,
        post_text: req.body.post_text,
        post_img: image
    }
    //validation du post avec le model postSchema
    const validPost = postSchema.validate(post);
    //if post not ok
    if (validPost.error) {
        deleteImg(req.file);
        return res.status(400).json({ message: validPost.error.message });
    }
    //if post ok
    else {
        //si img on ajoute son chemin à l'objet envoyé dans la db
        if (req.file) {
            //image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            image = `${req.file.filename}`;
        }
        post.post_img = image;
        //sauvegarde de l'objet en db
        db.query('INSERT INTO posts SET ?;', post, (err) => {
            if (err) {
                deleteImg(req.file);
                return res.status(400).json({ message: err });
            } else {
                return res.status(201).json({ message: "Post créé dans la db" });
            }
        });
    }
};

//route put pour modifier un post
exports.modifyPost = async (req, res, err) => {
    const authId = req.auth;
    const postId = req.params.id;
    db.query(`SELECT post_author_id FROM posts WHERE post_id = ${postId};`, (err, resultat) => {
        if (err) {
            res.status(400).json({ message: err });
        }
        else if (!resultat[0]) {
            deleteImg(req.file);
            return res.status(404).json({ message: "Poste introuvable" });
        }
        else {
            //on verifie que l'id de l'auteur est bien le meme que dans la db
            const postAuthor = resultat[0].post_author_id;
            if (postAuthor != authId && authId != 1) {
                deleteImg(req.file);
                return res.status(403).json({ message: "Vous ne pouvez pas modifier un post qui ne vous appartient pas !" });

                //si postid = postauthor
            } else {
                //on récupere tous les champs de la db
                db.query(`SELECT * FROM posts WHERE post_id = ${postId};`, (err, resultat) => {
                    if (err) {
                        return res.status(400).json({ message: err });
                    } else {
                        //création de l'objet post pour la requete préparé
                        const post = {
                            post_author_id: postAuthor,
                            post_title: req.body.post_title,
                            post_text: req.body.post_text,
                        };
                        //gestion image
                        req.file ? (post.post_img = req.file.filename) : (post.post_img = resultat[0].post_img);
                        const validPost = postSchema.validate(post);
                        //si l'objet post valide le model post
                        if (validPost.error) {
                            deleteImg(req.file);
                            return res.status(400).json({ message: validPost.error.message });
                        }
                        //si tout es ok
                        else {
                            db.query(`UPDATE posts SET ? WHERE post_id = '${postId}';`, post, (err) => {
                                if (err) {
                                    deleteImg(req.file);
                                    // 403 ?
                                    return res.status(400).json({ message: err });
                                }
                                else {
                                    //on recupere et supprime l'ancienne img si elle existe
                                    if(req.file && resultat[0].post_img && resultat[0].post_img != null && resultat[0].post_img != undefined && resultat[0].post_img != ""){
                                    const oldImage = resultat[0].post_img;
                                    fs.unlinkSync(`images/${oldImage}`);
                                    }
                                    return res.status(200).json({ message: "Post modifié." });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};

//route DELETE /id 
exports.deletePost = async (req, res) => {
    const userTryingToDeleteId = req.auth;
    const postId = req.params.id;
    if (!userTryingToDeleteId) {
        res.status(403).json({ message: "Connectez vous pour acceder à ce contenu." });
    }
    else {
        /// verif que postId exist
        db.query(`SELECT post_id FROM posts WHERE post_id = ${postId};`, (err, resultat) => {
            if (err) {
                return res.status(400).json({ message: err });
            }
            else if (resultat[0] == undefined) {
                return res.status(404).json({ message: "Post inexistant." });
            }
            else {
                //verif que post_author_id = usertryingtoDelete
                db.query(`SELECT post_author_id FROM posts WHERE post_id = ${postId};`, (err, result) => {
                    if (err) {
                        return res.status(400).json({ message: err });
                    }
                    else {
                        const postAuthor = result[0].post_author_id;
                        if (postAuthor != userTryingToDeleteId && userTryingToDeleteId != 1) {

                            return res.status(403).json({ message: "Vous ne pouvez pas supprimer ce post." });
                        }
                        else {
                            //suppression de l'image
                            db.query(`SELECT * FROM posts WHERE post_id = ${postId};`, (err, resu) => {
                                if (err) {
                                    return res.status(400).json({ message: err });
                                }
                                else {
                                    //si il y a une image (not NULL) on la supprime 
                                    if (resu[0].post_img.length > 1) {
                                        fs.unlinkSync(`images/${resu[0].post_img}`);
                                    }
                                }
                            });
                            // REVOIR ICI
                            //suppression des données
                            db.query(`DELETE posts, comments, likes FROM posts 
                            LEFT JOIN comments ON (comments.commented_post_id = posts.post_id)
                            LEFT JOIN likes ON (likes.like_post_id = posts.post_id) 
                            WHERE post_id = ?;`, postId, (err) => {
                                if (err) {
                                    return res.status(400).json({ message: err });
                                }
                                else {
                                    res.status(200).json({ message: "Post supprimé." });
                                }
                            });
                        }
                    }
                })
            }
        })
    }
};





