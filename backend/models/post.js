const Joi = require('joi');
//definition du schema des posts
const postSchema = Joi.object().keys({
    post_author_id: Joi.number().integer().required(),
    post_title: Joi.string().min(3).max(80).required().messages({
        'string.empty': `Le Titre ne peut pas être vide !`,
        'string.min': `Le titre doit avoir au moins {#limit} caractères !`,
        'string.max': `Le titre doit avoir moins de {#limit} caractères !`,
        'any.required': `Le titre est requis !`
      }),
    post_text: Joi.string().min(7).required().messages({
        'string.empty': `Le texte ne peut pas être vide !`,
        'string.min': `Le texte doit avoir au moins {#limit} caractères !`,
        'any.required': `Un texte est requis !`
      }),
    post_img: Joi.string().allow('').optional()
})
//cette option permet d'envoyer plusieurs messages si plusieurs champs sont invalides.
    .options({
        abortEarly: false
    });


module.exports = postSchema;


