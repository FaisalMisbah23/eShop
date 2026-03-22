const app = require("./app");
const connectToDb = require("./db/Database");

process.on("uncaughtException", (err) => {
  console.error(`uncaughtException: ${err.message}`);
  process.exit(1);
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

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