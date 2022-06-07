const Joi = require('joi');

//validation du mail avec package joi
const emailToValidate = Joi.object().keys({
    //tld = top level domain, ici accepte tous les TLD
    email: Joi.string().email({ tlds: { allow: false } })
});
module.exports = emailToValidate;