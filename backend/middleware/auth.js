// Permet d'importer jsonwebtoken
const jwt = require('jsonwebtoken');

// Permet la vérification du token envoyé par le frontend
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        } else {            
            next();
        }
    } catch (error) {
        res.status(401).json({ error: 'Requête non authentifiée'});
    }
};
