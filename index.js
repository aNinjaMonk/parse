const express = require('express');
const logger = require("morgan");
const parseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
var SimpleSendGridAdapter = require("parse-server-sendgrid-adapter");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

const api = new parseServer({
    databaseURI: process.env.databaseURI,
    cloud: "./cloud/main.js",
    appId: process.env.appId,
    masterKey: process.env.masterKey,
    serverURL: process.env.serverURL,
    appName: process.env.APP_NAME,
    fileKey: "optionalFileKey",
    verifyUserEmails: true,
    preventLoginWithUnverifiedEmail: false,
    publicServerURL: process.env.serverURL,
    emailAdapter: SimpleSendGridAdapter({
        apiKey: process.env.SENDGRID_KEY,
        fromAddress: process.env.SENDGRID_FROM
    }),
});

var options = { allowInsecureHTTP: false };
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
    ],
    useEncryptedPasswords: false,
}, options);

api.start();

app.use("/parse", api.app);
app.use("/dashboard", dashboard);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("short"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello!! I am a backend build upon Parse Server");
});

app.listen(PORT, () => {
    console.log("Server Running at : " + PORT);
});