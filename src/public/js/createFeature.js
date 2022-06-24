
window.addEventListener('load', () => {

	addEvents();

});

function addEvents() {

	const autocomplete = document.getElementById('autocomplete');
	autocomplete.addEventListener('click', (e) => {
		e.preventDefault();
		clickOnAutocomplete();
	});

	const submit = document.getElementById('preview');
	submit.addEventListener('click', (e) => {

		e.preventDefault();
		clickOnSubmit();

	})

	const copy = document.getElementById('copy');
	copy.addEventListener('click', (e) => {

		e.preventDefault();
		clickOnCopy();

	});

}

function clickOnAutocomplete() {

	const text = document.getElementById('csv').value;
	const inputs = document.getElementsByClassName('csv-input');
	const array = text.split(';');

	for (let i = 0; i < inputs.length; i++) {

		let element = array[i];
		let input = inputs[i];

		input.value = element;

	}

	document.getElementById('placeID').value = '';
	document.getElementById('previewCode').innerHTML = '';

}

async function clickOnSubmit() {

	const inputs = document.getElementsByClassName('csv-input');
	const inputsData = [];

	for (let i = 0; i < inputs.length; i++) {
		inputsData.push(inputs[i].value);
	}

	const placeDetails = await getPlaceDetails();

	if (!placeDetails.error) {
		previewJSON(placeDetails.data);
	}

}

async function getPlaceDetails() {

	const place_id = document.getElementById('placeID').value;

	const formData = new FormData();
	formData.append('place_id', place_id);

	return await fetch('/services/place/details', {
		method: 'POST',
		body: formData
	})
		.then((response) => response.json())
		.then((data) => { return data; })
		.catch((err) => console.error(err));

}

function previewJSON(placeDetails) {

	const inputs = document.getElementsByClassName('csv-input');
	const dataElement = [];

	for (let i = 0; i < inputs.length; i++) {
		dataElement.push(inputs[i].value);
	}

	const place_id_value = document.getElementById('placeID').value;

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
			place_id: place_id_value,
			international_phone_number: placeDetails.phone_number

		}
	}

	document.getElementById('previewContainer').classList.remove('d-none');
	const preview = document.getElementById('previewCode');
	preview.innerText = JSON.stringify(object, null, 4) + ',';

}

function clickOnCopy() {
	const preview = document.getElementById('previewCode');
	navigator.clipboard.writeText(preview.innerText);
}