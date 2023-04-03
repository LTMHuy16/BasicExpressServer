const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({
            message: "UserName and password are required",
        });
    }

    const duplicate = await User.findOne({ username: username }).exec();

    if (duplicate) return res.sendStatus(409);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username: username, password: hashedPassword });

        res.status(201).json({ status: `New user ${username} created` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    handleNewUser,
};
