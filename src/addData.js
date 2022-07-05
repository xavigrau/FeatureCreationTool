const data = require('./public/uploads/finals/plusPalma.json');
const axios = require("axios");


init().then(() => {
	console.log("ya estoy :)")
});

async function init() {

	for (let i = 0; i < data.length; i++) {

		await axios.post('http://localhost:4000/v1/add/', data[i])
			.then((response) => {
				console.log(response.data.message);

			})
			.catch((err) => {
				console.log(err.response?.data);

			})
	}

}

