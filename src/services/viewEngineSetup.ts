import express, { Express } from "express";

export default (app: Express) => {

    app.set('views', 'src/views');
    app.set('view engine', 'ejs');
    app.use(express.static('src/public'));

}