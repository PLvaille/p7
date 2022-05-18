//import du model de mot de pass qui devra être respecté
const passwordSchema = require('../models/password');

// vérifie que le mot de passe respecte le schema décrit
module.exports = async (req, res, next) => {
    if (!passwordSchema.validate(req.query.user_password)) {    
        res.status(400).send("Votre mot de passe doit contenir 8 caractères minimun, au moins 1 majuscule, 1 minuscule et sans espaces, et ne doit pas être trop simple");          
    } else {
        next();
    }
};