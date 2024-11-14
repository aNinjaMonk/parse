const express = require('express');
const parseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const app = express();
require('dotenv').config();
const PORT = 3030;

const api = new parseServer({
    databaseURI: process.env.databaseURI,
    cloud: "./cloud/main.js",
    appId: process.env.appId,
    masterKey: process.env.masterKey,
    serverURL: process.env.serverURL
});

var dashboard = new ParseDashboard({
    "apps": [
        {
            "serverURL": process.env.serverURL,
            "appId": process.env.appId,
            "masterKey" : process.env.masterKey,
            "appName": "My App"
        }
    ],
    "users": [
        {
            "user": process.env.USERNAME,
            "pass": process.env.PASSWORD
        }
    ]
});

api.start();

app.use("/parse", api.app);
app.use("/dashboard", dashboard);

app.get("/", (req, res) => {
    res.send("Hello to my Backend");
});

app.listen(PORT, () => {
    console.log("Server Running at : " + PORT);
});