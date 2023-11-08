const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
require("dotenv").config();

app.use(cors());

app.use(bodyParser.json());

app.use(authRoutes);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
        },
    });
});

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.udsdb9i.mongodb.net/${process.env.DB_name}`
    )
    .then(() => {
        app.listen(process.env.PORT || 3000);
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });
