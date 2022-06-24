import fs from 'fs';
import { parse } from 'csv-parse';
import {Request, Response} from "express";
import {dirname} from "path";
const axios = require('axios');
const appDir = dirname(require.main.filename);

export default async (req: Request, res: Response) => {

	if (!req.body.fileName) {
		res.send(500).send({error: "Missing filename parameter"})
	}

	const path = appDir + "/public/uploads/json/";
	const date = getDate();

	let jsonAdded = 0;
	let jsonError = 0;

	fs.createReadStream(appDir + '/public/uploads/csv/' + req.body.fileName)
		.pipe(parse({delimiter: ':'}))
		.on('data', async function (csvrow) {

			const element = csvrow.toString();
			const dataElement = element.split(';');

			if (dataElement[0] === '') {
				return;
			}

			const placeElement = await getPlace(dataElement[1], dataElement[5], dataElement[0]);

			if (placeElement.hasOwnProperty('error')) {

				if (!fs.existsSync(path + date)) {
					fs.mkdirSync(path + date);
				}
				jsonError++;
				fs.appendFileSync(path + date + "/error.csv", element + '\n', "utf8");
				return;
			}

			const placeDetails = await getPlaceDetails(placeElement.place_id);

			const object = {
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [placeDetails.geometry.lng, placeDetails.geometry.lat],
				},
				properties: {
					cnn: dataElement[0],
					caac: dataElement[2],
					country: placeDetails.country_code,
					comAut: dataElement[3],
					province: dataElement[4],
					town: dataElement[5],
					name: dataElement[1],
					pharmacy_name: placeDetails.name,
					address: placeDetails.formatted_address,
					postal_code: placeDetails.postal_code,
					schedule: {
						periods: placeDetails.periods,
						weekday_text: placeDetails.weekday_text
					},
					formatted_phone_number: placeDetails.formatted_number,
					place_id: placeElement.place_id,
					international_phone_number: placeDetails.phone_number
				}
			}

			try {

				if (!fs.existsSync(path + date)) {
					fs.mkdirSync(path + date);
				}

				jsonAdded++;
				fs.appendFileSync(path + date + "/result.json", JSON.stringify(object, null, 4) + ',\n', "utf8");

			} catch (e) {
				console.error(e);
			}

		}).on("close", () => {
			console.log('Done: parseFile');
			res.status(200).send({
				success: true,
				pharmaciesAdded: jsonAdded,
				pharmaciesError: jsonError,
				fileName: path + date
			});
		});

}

async function getPlace(name, city, id) {

	const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=place_id%2Cformatted_address&type=pharmacy");


	const newData = name.split('-');

	url.searchParams.append('input', newData[1]);
	url.searchParams.append('key', 'AIzaSyAFNWSHMnOLfDJIZKrJygK8K3IHAI6ua2Q');
	url.searchParams.append('inputtype', 'textquery');
	url.searchParams.append('language', 'en');

	const config = {
		method: 'GET',
		url: url.toString(),
		headers: {}
	};

	return await axios(config)
		.then(function (response) {

			let element = response.data.candidates[0];

			if (!element) {
				return { error: 'One feature error', cnn: id }
			}

			if (!element.hasOwnProperty('formatted_address')) {
				return { error: 'One feature error', cnn: id }
			}

			if (element.formatted_address.includes(city)) {
				return { place_id: element.place_id }
			}

			return { error: 'One feature error', cnn: id }

		})
		.catch(function (error) {
			console.log(error);
		});


}

export async function getPlaceDetails(place_id) {

	const url = new URL('https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Cinternational_phone_number%2Copening_hours%2Caddress_components%2Cformatted_address%2Cgeometry%2Cformatted_phone_number');

	url.searchParams.append('place_id', place_id);
	url.searchParams.append('key', 'AIzaSyAFNWSHMnOLfDJIZKrJygK8K3IHAI6ua2Q');

	const config = {
		method: 'GET',
		url: url.toString(),
		headers: {}
	};

	return await axios(config)
		.then(function (response) {

			const data = response.data.result;
			let postal_code = '', country_code = '', periods = '', weekday_text = '';


			if (data.hasOwnProperty('address_components')) {

				const address_components = response.data.result.address_components;

				for (let i = 0; i < address_components.length; i++) {

					let element = address_components[i];

					if (element.types.includes('postal_code')){
						postal_code = element.short_name;
					}

					if (element.types.includes('country')){
						country_code = element.short_name;
					}

				}
			}

			if (data.hasOwnProperty('opening_hours')) {
				periods = data.opening_hours.periods;
				weekday_text = data.opening_hours.weekday_text;
			}

			return {
				phone_number: data.international_phone_number,
				formatted_number: data.formatted_phone_number,
				postal_code: postal_code,
				country_code: country_code,
				periods: periods,
				weekday_text: weekday_text,
				name: data.name,
				formatted_address: data.formatted_address,
				geometry: {
					lng: data.geometry.location.lng,
					lat: data.geometry.location.lat
				}
			}

		})
		.catch(function (error) {
			console.log(error);
		});

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

	return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

}