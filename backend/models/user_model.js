const Joi = require('joi');

const userValidation = Joi.object().keys({
    user_nom: Joi.string().max(30).min(2).alphanum().required(),
    user_prenom: Joi.string().max(30).min(2).alphanum().required(),
    user_img: Joi.string().max(100).allow('').optional(),
    user_age: Joi.number().integer().min(18).max(100).required(),
    user_service: Joi.string().min(2).max(30).alphanum().allow('').optional()
})
    .options({
        abortEarly: false
    });

module.exports = userValidation;