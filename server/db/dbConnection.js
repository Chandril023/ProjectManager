
require('dotenv').config();
const mongoose = require('mongoose');
const DBconnect = process.env.DB;

const connectDB = async () => {
    try {
        await mongoose.connect(DBconnect, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Remove useFindAndModify and useCreateIndex options
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
