const jwt = require("jsonwebtoken");
require("dotenv").config();

const userDB = {
    users: require("../model/users.json"),
    setUsers(data) {
        this.users = data;
    },
};

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = userDB.users.find((person) => person.refreshToken == refreshToken);

    if (!foundUser) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error || foundUser.username !== decoded.username) return res.sendStatus(403);

        const accessToken = jwt.sign(
            {
                username: jwt.decode.username,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );

        res.json({ accessToken });
    });
};

module.exports = {
    handleRefreshToken,
};
