const express = require('express');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
const {CreateChannel} = require('./utils')
const dotEnv = require("dotenv");
dotEnv.config()

const StartServer = async () => {

    const app = express();

    await databaseConnection();
    
    const channel = CreateChannel()

    await expressApp(app ,channel);

    app.listen(process.env.PORT, () => {
        console.log(`listening to port ${process.env.PORT}`);
    })
        .on('error', (err) => {
            console.log(err);
            process.exit();
        })
}

StartServer();