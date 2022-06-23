import { Express } from "express";
import pages from "../routes/pages";
import services from "../routes/services";

export default (app: Express) => {
    
    // * Main pages
    app.use('/', pages)

    // * Services endpoints
    app.use('/services', services);

}