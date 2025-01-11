const app = require("./app")
const connectToDb = require('./db/Database')


// handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for handling the uncaught exception`);
})

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env"
    })
}

// create server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

// connect db
connectToDb();

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for unhandled promise rejection`);

    server.close(() => {
        process.exit(1);
    })
})