const Joi = require('joi');
//definition du schema d'utilisateur
const userValidation = Joi.object().keys({
    user_nom: Joi.string().max(30).min(2).alphanum().required().messages({
        'string.base' : `Veuillez utiliser une chaine de caractères`,
        'string.alphanum': `Votre "Nom" doit être alphanumerique !`,
        'string.empty': `"Nom" ne peut pas être vide !`,
        'string.min': `"Nom" doit avoir au moins {#limit} caractères !`,
        'any.required': `Votre "Nom" est requis !`
      }),
    user_prenom: Joi.string().max(30).min(2).alphanum().required().messages({
        'string.base' : `Veuillez utiliser une chaine de caractères`,
        'string.alphanum': `Votre "Prénom" doit être alphanumerique !`,
        'string.empty': `"Prénom" ne peut pas être vide !`,
        'string.min': `"Prénom" doit avoir au moins {#limit} caractères !`,
        'any.required': `Votre "Prénom" est requis !`
      }),
    user_img: Joi.string().max(100).allow('').optional().messages({
        'string.max' : `Le nom de votre fichier-image est trop grand !`,
    }),
    user_age: Joi.number().integer().min(18).max(100).required().messages({
        'number.base' : `Veuillez indiquer un entier naturel`,
        'number.min' : `Vous devez être majeur !`,
        'number.max' : `Désolé c'est interdit aux vieux !`
    }),
    user_service: Joi.string().min(2).max(30).allow('').optional().messages({
        'string.base' : `Veuillez utiliser une chaine de caractères`,
        'string.min': `Votre "Service" doit faire au moins {#limit} caractères !`,
        'string.max': `Votre "Service" ne peut faire plus de {#limit} caractères !`,
      })
})
//cette option permet d'envoyer plusieurs messages si plusieurs champs sont invalides.
    .options({
        abortEarly: false
    });

module.exports = userValidation;