const User = require('../models/user_model');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const cleanEmail = email.trim().toLowerCase();
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
            return res.status(400).json({ error: 'Пользователь с таким Email уже существует' });
        }
        const role = cleanEmail.includes('admin') ? 'admin' : 'user';
        const newUser = new User({ name, email: cleanEmail, password, role });
        await newUser.save();
        res.status(201).json({ message: 'Пользователь создан', role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: cleanEmail, password });
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        res.json({
            message: 'Вход выполнен',
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};