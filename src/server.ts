import express from 'express';
const fileupload = require("express-fileupload");
import { Request, Response } from "express";

import {config} from "dotenv";
config();

import routesSetup from "./services/routesSetup";
import viewEngineSetup from "./services/viewEngineSetup";

const app = express();


app.use(fileupload({
    createParentPath: true
}));

// Set up view engine
viewEngineSetup(app);

// Routes setup
routesSetup(app);

app.listen(process.env.PORT, () => {
    return console.log(`Express is listening at http://localhost:${process.env.PORT}`);
});