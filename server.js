const express = require("express");
const app = express();
const path = require("path");
const corse = require("cors");
const corsOptions = require("./config/coreOptions");
const { logger } = require("./middleware/logEvent");
const { errorHandler } = require("./middleware/errorHandler");
const { read, readSync } = require("fs");
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(corse(corsOptions));

// build-in middleware to handle urlencoded data (form-data)
app.use(express.urlencoded({ extended: false }));

// build-in middleware for json
app.use(express.json());

// serve static file
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/employees", require("./routes/api/employees"));

app.get("/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

app.all("*", () => {
    console.log("Error");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
