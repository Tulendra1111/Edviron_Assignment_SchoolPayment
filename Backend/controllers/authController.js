const authService = require('../services/authService');

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await authService.signup({ username, email, password });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, username } = await authService.login({ email, password });
        res.json({ token, username });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { signup, login };
