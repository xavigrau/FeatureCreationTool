import {Request, Response} from "express";
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

export default (req: Request, res: Response) => {

    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {

            const fileData = req.files.csvFile;

            if ('mv' in fileData) {

                var fileName = fileData.name.replace(" ", "_").split(".")[0] + '_' + getDate() + '.csv';

                var pathString = appDir + '/public/uploads/csv/' + fileName;

                fileData.mv(pathString, (err) => {

                    if (err) {

                        return res.status(500).send({
                           ok: false,
                           error: err
                        });
                    }
                });
            }

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                filename: fileName,
            });
        }
    } catch (err) {
        res.status(500).send({ error123: err });
    }

}

function getDate() {

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    return year + "-" + month + "-" + date + "_" + hours + ":" + minutes + ":" + seconds;

}