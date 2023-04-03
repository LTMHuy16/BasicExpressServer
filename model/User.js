const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    roles: {
        User: {
            type: Number,
            default: 2001,
        },
        Editor: Number,
        Admin: Number,
    },
    password: {
        type: String,
        require: true,
    },
    refreshToken: String,
});

module.exports = model("Employee", userSchema);
