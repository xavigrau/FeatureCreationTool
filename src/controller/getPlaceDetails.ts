import {Request, Response} from "express";
import {getPlaceDetails} from "./csvToJSON";

export default async (req: Request, res: Response) => {

    if (!req.body.place_id) {
        res.status(500).send({ error: true });
    }

    const place_id = req.body.place_id;

    const placeDetails = await getPlaceDetails(place_id);

    res.status(200).send({ error: false, data: placeDetails});

}