import express, {Request, Response} from 'express';
const router = express.Router();

import csvToJSONController from "../controller/csvToJSON";
import uploadFileController from "../controller/uploadFile";
import getPlaceDetails from '../controller/getPlaceDetails';

router.post('/csv', csvToJSONController);

router.post('/upload', uploadFileController);

router.post('/place/details', getPlaceDetails)
export default router;