const database = require('../models');
const bcrypt = require('bcrypt');

class AuthenticationController {
    static async readAllUsers(req, res) {
        try {
            const allUsers = await database.Users.findAll();
            allUsers.forEach(user => {
                user.password = null;
            });
            return res.status(200).json(allUsers);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async readAllNames(req, res) {
        try {
            const allNames = await database.Users.findAll({ attributes: ['id', 'firstName', 'lastName'] });
            return res.status(200).json(allNames);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async readUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await database.Users.findOne({ 
                where: { 
                    id: Number(id) 
                } 
            });
            if(user == null) return res.status(200).json({ message: `User ${id} not found!` });
            user.password = null;
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async createUser(req, res) {
        const formUser = req.body;
        const selectUser = await database.Users.findOne({where: {email: formUser.email}});
        if(selectUser) return res.status(507).json({ message: 'Email has been registered' });
        if(formUser.password === null) return res.status(400).json({ message: 'Password is required' });
        if(formUser.profile_id === null) formUser.profile_id = 4;
        try {
            formUser.password = bcrypt.hashSync(formUser.password, 10);
            const user = await database.Users.create(formUser);
            user.password = null;
            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async updateUser(req, res) {
        const { id } = req.params;
        const formUser = req.body;
        try {
            const user = await database.Users.findByPk(id);
            if(user === null) return res.status(404).json({ message: 'User not found' });
            await database.Users.update(formUser, {
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json({ message: `ID ${id} updated` });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const user = await database.Users.findByPk(id);
            if(user === null) return res.status(404).json({ message: 'User not found' });
            await database.Users.destroy({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json({ message: `ID ${id} deleted` });
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

module.exports = UserController