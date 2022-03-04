const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../mysqlConnect');
const dotenv = require("dotenv");
dotenv.config({path: './.env'});



/* -- SIGNUP -- */

exports.signup = (req, res, next) => {
    const password = req.body.password; 
    const username = req.body.username;
    bcrypt.hash(password, 10)
        .then(hash => {   
            const sqlQuery = "INSERT INTO `users` SET ?"
            const bindings = {
                username:username,
                email:req.body.email,
                password : hash 
            } 
            const preparedUserInfo = db.format(sqlQuery, [bindings])
            db.query(preparedUserInfo, (error, result, field) => {
                if (error) {
                    console.log(error)
                    return res.status(400).json("erreur")
                }
                console.log('création de compte utilisateur : ' + username)
                return res.status(201).json({message : 'Votre compte a bien été crée !'},)
            });
        })
        .catch(error => res.status(500).json({ error })
    );
};



/* -- LOGIN -- */

exports.login = (req, res, next) => {
    const password = req.body.password
    const username = req.body.username;
    db.query(
        'SELECT * FROM users WHERE username= ?',
        username, 
        (error, results, _fields) => {
            console.log(results[0])
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password).then((valid) => {
                    if (!valid) {
                        res.status(401).json({ message: 'Utilisateur ou mot de passe inconnu' })
                    } else {
                        console.log(username, "s'est connecté")
                        res.status(200).json({
                        id: results[0].id,
                        token: jwt.sign({ user_id: results[0].id },process.env.TOKEN_USER,{ expiresIn: '24h' }),
                    })
                }
            })
        } 
    else {
            res.status(401).json({ message: 'Utilisateur ou mot de passe inconnu' })
    }
    })
};


/* -- ONE USER -- */

exports.getConnectedUser = (req, res, next) => {
    console.log('test1')
    const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jwt.verify(token, process.env.TOKEN_USER); 
        const userId = decodedToken.user_id;
        console.log(userId)
    db.query('SELECT * FROM users WHERE id= ? ', userId, (error, result, field) => {
        if (error) {
            return res.status(400).json({ error })
        }
        console.log('récupération d un utilisateur')
        return res.status(200).json(result[0])
    })
};



/* --  DELETE  -- */


exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, process.env.TOKEN_USER); 
    const userId = decodedToken.user_id;

    // récupération de l'id admin
    db.query( 
    'SELECT * FROM users WHERE username= "admin" ',
        (error, result, field) => {
            if (error) {
                console.log('erreur fetch admin id '+ error )
                return res.status(400).json({ error })
            }
            const admin_id = result[0].id;

            // récupération des messages de l'utilisateur 
            // et on les transfère sur le compte de l'admin 
            db.query( 
                'UPDATE messages SET user_id= ? WHERE user_id= ? ', 
                [admin_id, userId],  
                (error, result, field) => {
                    if (error) {
                        console.log('erreur 1 '+ error )
                        return res.status(400).json({ error })
                    }
                    // puis on supprime l utilisateur
                    db.query(
                        'DELETE FROM users WHERE id=?', 
                        userId, 
                        (error, result, fields) => {
                            if (error) {
                                return res.status(400).json(error)
                            }            
                            console.log('suppression du compte utilisateur : ' + userId)
                            return res.status(200).json({ message: 'Votre message a bien été supprimé !' })
                        }
                    )
                }
            )
        }
    )   
};




// /* -- ALL USERS -- */

// exports.getAllUsers = (req, res, next) => {
//     db.query('SELECT * FROM users ORDER BY id DESC', (error, result, field) => {
//         if (error) {
//             return res.status(400).json({ error })
//         }
//         console.log('récupération de tous les utilisateurs')
//         return res.status(200).json(result)
//     })
// };





