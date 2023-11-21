const mongoose = require('mongoose');
// const { DB_URL } = require('../config');
const dotEnv = require("dotenv");
dotEnv.config()

module.exports = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Shopping Db Connected !!!');

    } catch (error) {
        console.log('Error ============')
        console.log(error);
        process.exit(1);
    }

};

