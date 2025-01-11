const mongoose = require("mongoose")

const connectToDb = () => {
    mongoose.connect(process.env.DB_URL).then((data) => {
        console.log(`mongodb connected with server: ${data.connection.host}`)
    })
}

module.exports = connectToDb;