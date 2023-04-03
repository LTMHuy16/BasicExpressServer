require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const corse = require("cors");
const { read, readSync } = require("fs");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

const corsOptions = require("./config/coreOptions");
const { logger } = require("./middleware/logEvent");
const { errorHandler } = require("./middleware/errorHandler");
const { verifyJWT } = require("./middleware/JWT");
const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);

app.use(corse(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));

app.use(verifyJWT);
app.use("/logout", require("./routes/logout"));
app.use("/employees", require("./routes/api/employees"));

app.get("/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

app.all("*", () => {
    console.log("Error");
});

mongoose.connection.once("open", () => {
    console.log("Connected to mongooseDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
