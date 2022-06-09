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
                token = jwt.sign({user_id: selectedUser.id}, process.env.SECRET);
            } else {
                token = jwt.sign({user_id: selectedUser.id}, process.env.SECRET, {expiresIn});
            }
            return res.status(200).header('authorization_token', token).json({ message: 'User logged!' });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = AuthenticationController;