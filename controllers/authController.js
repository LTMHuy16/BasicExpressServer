const bcrypt = require("bcrypt");

const userDB = {
    users: require("../model/users.json"),
    setUsers(data) {
        this.users = data;
    },
};

const handleLogin = async (req, res) => {
    const { user, password } = req.body;
    if (!user || !password) {
        return res.status(404).json({
            message: "UserName and password are required",
        });
    }

    const foundUser = userDB.users.find((person) => person.username == user);
    if (!foundUser) return res.sendStatus(401);

    const matchPassword = await bcrypt.compare(password, foundUser.password);

    if (matchPassword) {
        res.json({
            success: `User ${user} is logged in`,
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    handleLogin,
};
