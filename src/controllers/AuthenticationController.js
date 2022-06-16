require('dotenv-safe').config();
const database = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class AuthenticationController {
    static async login(req, res) {
        try {
            const selectedUser = await database.Users.findOne({ 
                where: { 
                    email: req.body.email
                } 
            });
            
            if(!selectedUser) return res.status(404).json({ message: 'Incorrect Email or Password' });
            const isValid = bcrypt.compareSync(req.body.password, selectedUser.password);
            if(!isValid) return res.status(404).json({ message: 'Incorrect Email or Password' });

            var token;
            const expiresIn = parseInt(process.env.EXPIRES);
            if(req.body.remember){
                token = jwt.sign({userId: selectedUser.id}, process.env.SECRET);
            } else {
                token = jwt.sign({userId: selectedUser.id}, process.env.SECRET, {expiresIn});
            }
            var data = {
                token: token,
                username: selectedUser.firstName, 
                userId: selectedUser.id
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async verifyJWT(req, res, next) {
        let token = req.headers['authorization'];
        if(!token) return res.sendStatus(401);
        token = token.replace('Bearer', "");
            
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            res.locals.username = decoded.username;
            next;    
        } catch (error) {
            res.sendStatus(401).json({ message: "Unauthorized!" })
        }
    }
}

module.exports = AuthenticationController;