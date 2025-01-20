const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")
const bodyParser = require("body-parser");
const path = require("path");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000',],
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env"
    })
}

// import routes
const user = require("./controllers/user")
const shop = require("./controllers/shop.js")

app.use("/api/v2/user", user)
app.use("/api/v2/shop", shop)


// It's for Error Handling
app.use(ErrorHandler);


module.exports = app;