const Joi = require('joi');
//definition du schema d'un commentaire
const commentSchema = Joi.object().keys({
    comment : Joi.string().min(1).required().messages({
        'string.empty': `Le commentaire ne peut pas être vide !`,
        'string.min': `Le commentaire doit avoir au moins {#limit} caractère !`,
        'any.required': `Un texte de commentaire est requis !`
      }),
});

module.exports = commentSchema;