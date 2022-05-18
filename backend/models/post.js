const Joi = require('joi');

const postSchema = Joi.object().keys({
    post_author_id: Joi.number().integer().required(),
    post_title: Joi.string().min(3).max(80).required(),
    post_text: Joi.string().min(7).required(),
    post_img: Joi.string().allow('').optional()
})
    .options({
        abortEarly: false
    });


module.exports = postSchema;


