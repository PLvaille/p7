//import de la db
const db = require('../database_connect');
//import du schema de post avec joi
const commentSchema = require('../models/comment');

exports.comment = async (req, res) => {
  //  console.log(req);
    const validPost = commentSchema.validate({ comment: req.body.comment_text });
    if (validPost.error) {
        return res.status(400).send(validPost.error.message);
    }
    else {
        const commented_post_id = parseInt(req.params.postId);
        const comment_author_id = req.auth;
        const comment_text = req.body.comment_text;
       // console.log(commented_post_id);
        db.query(`INSERT INTO comments (commented_post_id, comment_author_id, comment_text) VALUES (?,?,?);`, [commented_post_id, comment_author_id, comment_text], (err) => {
            if (err) {
                return res.status(400).send(err);
            }
            else {
                return res.status(200).send("Commentaire publié !");
            }
        });
    }
};
exports.getComments = async (req, res) => {
    const postId = req.params.postId;
    // console.log("get comments id  : " + postId);
    db.query('SELECT * FROM comments LEFT JOIN users ON (users.user_id = comments.comment_author_id) WHERE commented_post_id = ?;', postId, (err, result) => {
        if (err) {
            return res.status(400).send(err);
        }
        else {
            result.forEach(e => {
                const dateEdit = JSON.stringify(e.comment_date).slice(0, 21).replace('T', ' à ').replace('"', 'le ');
                e.comment_date = dateEdit;
                delete e.user_password;
                //console.log(e);
            
            });
            return res.status(200).send(result);
        }
    })
}

exports.modifyComment = async (req, res) => {
    const userId = req.auth;
    //const postId = req.params.postId;
    const commentId = req.params.id;
    const newComment = req.body.comment_text;
    // console.log("auth : " + userId + " postid : " + postId + " commentId : " + commentId + " newcomment : " + newComment);
    // console.log("--------------------------------");
    // console.log((newComment));
    db.query(`SELECT * FROM comments WHERE comment_id = ?;`, commentId, (err, resultat) => {
        console.log(resultat[0]);
        if (err) {
            return res.status(400).send(err);
        }
        if (!resultat[0]) {
            return res.status(404).send("Commentaire introuvable");
        }
        if (resultat[0].comment_author_id == userId || userId == 1) {
            const validPost = commentSchema.validate({ comment: newComment });
            if (validPost.error) {
                return res.status(400).send(validPost.error.message);
            }
            else {
                db.query('UPDATE `comments` SET `comment_text` = ? WHERE `comment_id` = ?;', [newComment, commentId], (error, result) => {
                    if (error) {
                        return res.status(400).send(error);
                    }
                    else {
                        return res.status(200).send("Commentaire modifié !");
                    }
                });
            }
        }
        else {
            return res.status(403).send("Vous ne pouvez pas modifier un commentaire qui ne vous appartient pas");
        }
    })
};

exports.deleteComment = async (req, res) => {
    const userId = req.auth;
    const postId = req.params.postId;
    const commentId = req.params.id;
    db.query(`SELECT * FROM comments WHERE comment_id = ?;`, commentId, (err, resultat) => {
        // console.log(resultat[0].comment_author_id);
        // console.log(userId);
        if (err) {
            return res.status(400).send(err);
        }
        if (!resultat[0]) {
            return res.status(404).send("Commentaire introuvable");
        }
        if (resultat[0].comment_author_id == userId || userId == 1) {
            db.query(`DELETE FROM comments WHERE comment_id = ?;`, commentId, (error, result) => {
                if (error) {
                    return res.status(400).send(error);
                }
                else {
                    return res.status(200).send("Commentaire supprimé !");
                }
            })
        }
        else {
            return res.status(403).send("Vous ne pouvez pas modifier un commentaire qui ne vous appartient pas");
        }
    });
};

exports.addLike = async (req, res) => {
   
    const userId = req.auth;
    const postId = req.params.postId;
    //console.log("---- ADDLIKE ----");
    // console.log(userId);
    // console.log(postId);

    //verif que post exist
    db.query('SELECT post_id FROM posts WHERE post_id = ?;', postId, (err, resu) => {
        if (err) {
            return res.status(400).send(err);
        }
        if (!resu || resu[0] == undefined || resu == []) {
            return res.status(404).send("Post Inexistant");
        }
        else {
            db.query('SELECT * FROM likes WHERE like_post_id = ? AND like_user_id = ?;', [postId, userId], (err, resultat) => {
                if (err) {
                    console.log("L 132")
                    console.log(err)
                    return res.status(400).send(err);
                }
                else {
                    if (resultat[0] == undefined) {
                        db.query('INSERT INTO likes (like_user_id, like_post_id) VALUES (?,?);', [userId, postId], (err) => {
                            if (err) {
                                console.log("L 140")
                                console.log(err)
                                return res.status(400).send(err);
                            }
                            else {
                                return res.status(200).send("like enregistré");
                            }
                        })
                    }
                    else if (resultat[0]) {
                        db.query('DELETE FROM likes WHERE like_id = ?', resultat[0].like_id, (err) => {
                            if (err) {
                                console.log("L 152")
                                console.log(err)
                                return res.status(400).send(err);
                            }
                            else {
                                return res.status(200).send("like supprimé");
                            }
                        });
                    }
                }
            });
        }



    })
};

exports.getLikes = async (req, res) => {
    const userId = req.auth;
    const postId = req.params.postId;
    db.query('SELECT post_id FROM posts WHERE post_id = ?;', postId, (err, resu) => {
        if (err) {
            return res.status(400).send(err);
        }
        if (!resu || resu[0] == undefined || resu == []) {
            return res.status(404).send("Post Inexistant");
        }
        else {
            db.query('SELECT * FROM likes WHERE like_post_id = ?', postId, (err, resul) => {
                if (err) {
                    return res.status(400).send(err);
                }

                else {
                    if (!resul || resul[0] == undefined || resul == []) {
                        return res.status(200).send([]);
                    }
                    else {
                        // console.log(resul);
                        //console.log(likes[0].length);
                        return res.status(200).send(resul);
                    }
                }

            })
        }
    })
};
