const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({
            message: "UserName and password are required",
        });
    }

    const foundUser = await User.findOne({ username });
    if (!foundUser) return res.sendStatus(401);

    const matchPassword = await bcrypt.compare(password, foundUser.password);

    if (matchPassword) {
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                userInfo: {
                    username: foundUser.username,
                    roles,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );
        const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    handleLogin,
};
