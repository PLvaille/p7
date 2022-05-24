//import de la db
const db = require('../database_connect');
//import du package de hashage bcrypt
const bcrypt = require('bcrypt');
//import de jwt pour les tokens
const jwt = require('jsonwebtoken');
//import de joi pour validation de l'email & du model user
const emailValidation = require('../models/user_mail');
const userValidation = require('../models/user_model');
//import de fs pour gerer les fichiers
const fs = require('fs');
//import des variable d'environnement
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, './.env')
});

// création d'un utlisateur, email doit être valide (et unique mais c'est géré côté db)
exports.createNewUser = async (req, res) => {
    //image par default
    let image = `${req.protocol}://${req.get('host')}/images/defaulthuman.jpg`;
    //tester null 
    if (!req.body.user_email || !req.body.user_password) {
        if (req.file) {
            fs.unlinkSync(`images/${req.file.filename}`)
        }
        return res.status(400).json({ message: "Veuillez indiquer un e-mail et un mot de passe." })
    }
    //on test si l'email est au bon format
    const emailToTest = { email: req.body.user_email };
    const validEmail = emailValidation.validate(emailToTest);
    //si format invalide
    if (validEmail.error || emailToTest.email == undefined) {
        if (req.file) {
            fs.unlinkSync(`images/${req.file.filename}`)
        }
        return res.status(400).json({ message: "Adresse e-mail incorrecte" });
        //si format valide
    } else {
        //hash du mot de passe
        bcrypt.hash(req.body.user_password, 10)
            .then((hash) => {
                //objet à envoyer dans la requete mysql
                const userToValidate = {
                    user_nom: req.body.user_nom,
                    user_prenom: req.body.user_prenom,
                    user_img: image,
                    user_age: req.body.user_age,
                    user_service: req.body.user_service
                }
                //on verifie les champs avec Joi
                const validUser = userValidation.validate(userToValidate);
                if (validUser.error) {
                    if (req.file) {
                        fs.unlinkSync(`images/${req.file.filename}`)
                    }
                    return res.status(400).json({ message: "Erreur de formulaire " + validUser.error });
                }
                else {
                    if (req.file) {
                        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                    }
                    // objet user complet à envoyer en bdd
                    const user = {
                        user_password: hash,
                        user_nom: req.body.user_nom,
                        user_prenom: req.body.user_prenom,
                        user_img: image,
                        user_email: req.body.user_email,
                        user_age: req.body.user_age,
                        user_service: req.body.user_service
                    };
                    //requete msql préparée pour inserer l'user dans la table users
                    db.query('INSERT INTO users SET ?', user, (error, results) => {
                        //si on ne peut pas insérer dans la db c'est que l'email existe deja
                        if (error) {
                            fs.unlinkSync(`images/${req.file.filename}`)
                            res.status(400).json({ message: "Cette adresse email est déjà utilisé " + error });
                            // si aucun probleme on créer la row dans la db
                        } else {
                            res.status(201).json({ message: "Utilisateur créé !" });
                        }
                    });
                }
            })
            .catch(err => { fs.unlinkSync(`images/${req.file.filename}`);
              res.status(400).json(err);
           
        });
    }
};

// si login ok => renvoie un objet avec id et token
exports.login = async (req, res) => {
    if (!req.body.user_email) {
        return res.status(400).json({ message: "Veuillez saisir votre adresse mail et votre mot de passe." });
    }
    else {
        db.query('SELECT * FROM users WHERE user_email = ?', req.body.user_email, (err, resultat) => {
            if (err) {
                // si username était unique on pourrait mettre une query user name ici pour se loger soit avec le mail soit avec username
                return res.status(400).json({ err })
            }
            else if (!resultat[0]) {
                return res.status(404).json({ message: "Utilisateur non trouvé, vérifiez votre adresse mail ou créez un compte !" });
            } else {
                //le resultat est un tableau contenant la (ou les) ligne en format objet
                //on prendra donc le tableau à l'index 0 pour la premiere row de la bd avec collone = key de l'objet
                //resultat[0]
                //si l'utilisateur existe on va compararer les hash de bcrypt pour s'assurer du bon password
                bcrypt.compare(req.body.user_password, resultat[0].user_password)
                    .then(valid => {
                        //si mdp invalide
                        if (!valid) {
                            return res.status(401).json({ message: "Mot de passe incorrect !" });
                        }
                        else {
                            //console.log("OK RESP ========= ");
                            //sinon on attribu un token à l'utilisateur pour 24h en utilisant la clé défini dans les variables d'environnement
                            res.status(200).json({
                                //message: "connexion réussie",
                                //userId: resultat[0].user_id,
                                token:
                                    jwt.sign(
                                        { userId: resultat[0].user_id },
                                        `${process.env.TOKEN}`,
                                        { expiresIn: '24h' }
                                    )
                            });
                        }
                    })
                    .catch(error => res.status(500).json(error));
            }
        });
    }
};

// renvoi soit toutes les infos si c'est le bon user soit infos partiels
exports.getUserById = async (req, res) => {
    const requestedid = req.params.id;
    const userId = req.auth;
    //on peut pas request l'admin
    if (requestedid == 1) {
        return res.status(403).json({ message: "vous ne pouvez pas consulter ce profil" });
    }
    db.query('SELECT * FROM users WHERE user_id = ?', requestedid, (err, resultat) => {
        if (err) {
            return res.status(400).json({ err });
        }
        else if (!resultat[0]) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }
        else {
            if (userId == requestedid || userId == 1) {
                //si l'utilisateur consulte son propre profile
                delete resultat[0].user_password;
                return res.status(200).json(resultat);
            }
            else {
                //on n'envoie pas le password et le mail à un autre utilisateur, on les delete donc de l'objet      
                delete resultat[0].user_password;
                delete resultat[0].user_email;
                return res.status(200).json(resultat);
            }
        }
    })
};

exports.modifyUser = async (req, res) => {
    //par précaution avant chaque return on aura un fs.unlink car le middleware multer est avant modifyUser et peut enregistrer des images.
    const userId = req.auth;
    const requestedId = req.params.id;
    //cas ou on veut modifier l'admin
    if (requestedId == 1) {
        return res.status(403).json({ message: "Requête interdite !" });
    }
    //on récupere les infos de l'utilisateur à l'id demandé
    db.query(`SELECT * FROM users WHERE user_id = ?;`, requestedId, (error, resultat) => {
        if (error) {
            return res.status(400).json(error);
        }
        //cas ou aucun utilisateur ne correspond à l'id du param
        else if (!resultat[0]) {
            if (req.file) {
                fs.unlinkSync(`images/${req.file.filename}`)
            }
            return res.status(404).json({ message: "Utilisateur inexistant" });
        }
        //cas ou l'id demandé n'est pas celui de l'user auth
        else if (resultat[0].user_id != userId && userId != 1) {
            if (req.file) {
                fs.unlinkSync(`images/${req.file.filename}`)
            }
            return res.status(403).json({ message: "Vous ne pouvez pas modifier un autre utilisateur" });
        }
        //si tout est bon 
        else {
            //on initialise des variables avec les anciennes valeurs si il y a des champs vides
            //var nom = req.body.user.nom ? yes : no;
            //etc

            var nom = req.body.user_nom ? (req.body.user_nom) : (resultat[0].user_nom);
            var prenom = req.body.user_prenom ? (req.body.user_prenom) : (resultat[0].user_prenom);
            var age = req.body.user_age ? (req.body.user_age) : (resultat[0].user_age);
            var image = req.file ? (`${req.protocol}://${req.get('host')}/images/${req.file.filename}`) : (resultat[0].user_img) ? (resultat[0].user_img.slice(35)) : ("");
            var service = req.body.user_service ? (req.body.user_service) : (resultat[0].user_service) ? (resultat[0].user_service) : ("");


            if (req.body.user_email) {
                var newemail = req.body.user_email;
            }
            else if (!req.body.user_email || req.body.user_email == "") {
                var email = resultat[0].user_email;
            }
            if (req.body.user_password) {
                var password = req.body.user_password;
            }
            else if (!req.body.user_password || req.body.user_password == "") {
                var oldPassword = resultat[0].user_password;
            }

            const modifyRequest = {
                user_nom: nom,
                user_prenom: prenom,
                user_age: age,
                user_service: service,
                user_img: image,
            }
            //on valide les nouvelles données avec JOI
            const validUser = userValidation.validate(modifyRequest);

            //on ajoute l'email à l'objet
            modifyRequest.user_email = email;
            //si il y a un nouveau mail saisi on le valide et on l'ajoute à l'objet
            if (newemail) {
                const tryemail = { email: newemail };
                const validEmail = emailValidation.validate(tryemail);
                // cas ou le mail n'est pas valide
                if (validEmail.error) {
                    if (req.file) {
                        fs.unlinkSync(`images/${req.file.filename}`);
                    }
                    return res.status(400).json({ message: "Nouvel e-mail invalide ! " + validEmail.error.message });
                }
                else {
                    //si valide ajout à l'objet
                    modifyRequest.user_email = newemail;
                }
                //  console.log("----------------- l264 --")
                //   console.log(modifyRequest);
            }


            // cas ou le reste du formulaire est invalide
            if (validUser.error) {
                if (req.file) {
                    fs.unlinkSync(`images/${req.file.filename}`)
                }
                return res.status(400).json({ message: validUser.error.message });
                //si tout est valide 
            } else {
                //on ajoute password 
                if (!password) {
                    modifyRequest.user_password = oldPassword;
                }
                //si un nouveau password est indiqué on vérifie son format
                if (password) {
                    //import du model de mot de pass qui devra être respecté
                    const passwordSchema = require('../models/password');

                    if (!passwordSchema.validate(password)) {
                        if (req.file) {
                            fs.unlinkSync(`images/${req.file.filename}`)
                        }
                        return res.status(400).send("Votre mot de passe doit contenir 8 caractères minimun, au moins 1 majuscule, 1 minuscule et sans espaces, et ne doit pas être trop simple");
                    }
                    //si le password indiqué est valide on le hash
                    else if (passwordSchema.validate(password)) {
                        bcrypt.hash(password, 10)
                            .then((hash) => {
                                //on sauvegarde egalement le nouveau path de la nouvelle image s'il y en a une
                                modifyRequest.user_password = hash;
                            })
                            .catch(error => res.status(500).json({ error }));
                    }
                }
                //maintenant qu'on a le mot de passe on passe à la requete UPDATE, notre seule erreur peut être un doublon d'email
                db.query(`UPDATE users SET ? WHERE user_id = ${req.params.id};`, modifyRequest, (err, response) => {
                    if (err) {
                        if (req.file) {
                            fs.unlinkSync(`images/${req.file.filename}`);
                        }
                        return res.status(400).json({ message: "Adresse email déjà utilisé : " + err.message });
                    }
                    else {
                        //on supprime l'ancienne image et mise à jour de la db
                        if (req.file && resultat[0].user_img.length > 35) {
                            fs.unlinkSync(`images/${resultat[0].user_img.slice(35)}`);
                        }
                        return res.status(201).json({ message: "Utilisateur modifié !" });
                    }
                });
            }
        }
    });
}

exports.deleteUser = async (req, res) => {
    // il faudra prévoir une table de sauvegarde dans le milieu pro
    // => pas de cascade j'ai pas mis en place la logique de FK cascades

    // supprimer les posts tous les comms & likes des dits posts et les fichiers
    const userToDelete = req.params.id;
    //on sécurise l'admin
    if (userToDelete == 1) {
        return res.status(403).json("Requête impossible.")
    }
    const userId = req.auth;
    if (userToDelete == userId || userId == 1) {
        //on supprimera le profil de l'utilisateur, ses posts et tous les commentaires liés à ses posts et ses commentaires
        db.query(`SELECT * FROM users LEFT JOIN posts ON (user_id = post_author_id) WHERE user_id = ?;`, userToDelete, (err, resultat) => {
            if (err) {
                return res.status(400).json(err);
            }
            else {
                let images = [];
                //suppression des images des posts, on stock les images dans un tableau
                resultat.forEach(e => {
                    images.push(e.post_img.slice(34));
                });

                //on supprimes les doublons du tableau images
                let uniqueImages = [...new Set(images)];
                //et on supprime les images du tableau du dossier post-images
                uniqueImages.forEach(e => {
                    if (e.length > 4) {
                        fs.unlinkSync(`post-images/${e}`);
                        // console.log(e + " : supprimée !!!");
                    }
                });

                if (resultat[0].user_img.slice(35).length > 4) {
                    fs.unlinkSync(`images/${resultat[0].user_img.slice(35)}`);
                }
                //suppression des entrées de la db
                //SET SQL_SAFE_UPDATES = 0; ????
                db.query(`DELETE users, posts, comments, likes 
                FROM users
                LEFT JOIN posts ON (users.user_id = posts.post_author_id) 
                LEFT JOIN comments ON (comments.commented_post_id = posts.post_id) 
                LEFT JOIN likes ON (likes.like_user_id = users.user_id) 
                WHERE users.user_id = ?;`, userToDelete, (err) => {
                    if (err) {
                        return res.status(400).json({ message: err });
                    }
                    else {
                        return res.status(200).json(({ message: "Toutes les entrées de l'utilisateur ont été supprimées !" }));
                    }
                }); //fin 2eme query
            }
        }); //fin 1ere query
    } //fin if userTodelete == userId || userId == 1
    else {
        return res.status(403).json({ message: "Requête interdite, vous ne pouvez pas supprimer un autre utilisateur !" });
    }
};

