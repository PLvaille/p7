const Joi = require('joi');

const commentSchema = Joi.object().keys({
    comment : Joi.string().min(1).required(),
});

module.exports = commentSchema;