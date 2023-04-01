const bcrypt = require("bcrypt");
const fsPromise = require("fs/promises");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
        const accessToken = jwt.sign({ username: foundUser.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
        const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

        const otherUsers = userDB.users.filter((person) => person.user != foundUser.user);
        const currentUser = { ...foundUser, refreshToken };
        userDB.setUsers([...otherUsers, currentUser]);

        await fsPromise.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(userDB.users));

        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    handleLogin,
};
