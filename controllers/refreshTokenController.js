const jwt = require("jsonwebtoken");
const User = require("../model/User");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error || foundUser.username !== decoded.username) return res.sendStatus(403);

        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                userInfo: {
                    username: jwt.decode.username,
                    roles: roles,
                },
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
