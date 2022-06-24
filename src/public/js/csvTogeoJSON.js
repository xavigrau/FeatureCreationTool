
window.addEventListener('load', () => {
	addEvents();
});

function addEvents() {

	// Add event listener to preview button
	const preview = document.getElementById('preview');
	preview.addEventListener('click', (e) => {
		e.preventDefault();
		previewForm();
	});

	// Add event listener to submit button
	const submit = document.getElementById('submit');
	submit.addEventListener('click', (e) => {
		e.preventDefault();
		submitForm();
	});

	// Add event listener on change input file
	const input = document.getElementById('csvFile');
	input.addEventListener('change', () => {
		getFileData();
	});

}

async function submitForm() {

	const file = document.getElementById('csvFile');
	const response = await uploadFile(file);

	if (response.success) {
		let data = await convertToJSON(response.filename);
		displaySuccessMessage(data);
	}

}

function previewForm() {
	readFile();
}

// Helpers
function readFile() {

	$("#parsed_csv_list").html("");

	$('#csvFile').parse({
		config: {
			delimiter: ';',
			delimiterstoGuess: ';',
			skipEmptyLines: true,
			complete: displayHTMLTable,
		},
		before: function(file, inputElem)
		{
			console.log("Parsing file...", file);
		},
		error: function(err, file)
		{
			console.log("ERROR:", err, file);
		},
		complete: function()
		{
			console.log("Done with all files");
		}
	});

}

function getFileData() {

	$('#csvFile').parse({
		config: {
			delimiter: ';',
			delimiterstoGuess: ';',
			skipEmptyLines: true,
			complete: (response) => {

				let counter = 0;
				for (let i = 0; i < response.data.length; i++) {
					let element = response.data[i][0];
					if (element !== '') {
						counter++;
					}
				}
				displayFileData(counter);

			},
		},
		before: function(file, inputElem)
		{
			console.log("Parsing file...", file);
		},
		error: function(err, file)
		{
			console.log("ERROR:", err, file);
		},
		complete: function()
		{
			console.log("Done with all files");
		}
	});



}

async function uploadFile(file) {

	const fd = new FormData();
	fd.append('csvFile', file.files[0]);

	return await fetch('/services/upload', {
		method: 'POST',
		body: fd
	})
		.then((response) => response.json())
		.then((data) => {

			if (!data.status) {
				return {
					success: false
				}
			}

			return {
				success: true,
				filename: data.filename
			}

		})
		.catch((err) => {
			console.log(err)
		});
}

async function convertToJSON(filename) {

	const formData = new FormData();
	formData.append('fileName', filename);

	console.log(filename);

	return await fetch('/services/csv/', {
		method: 'POST',
		body: formData
	})
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		return data;
	})
	.catch((err) => {
		console.log(err)
	});

}

function displayHTMLTable(results){

	let table = "<table class='table'>";
	const data = results.data;

	for(let i = 0; i < data.length; i++){
		table+= "<tr>";
		const row = data[i];
		const cells = row.join(",").split(",");

		for(let j = 0; j < cells.length; j++){
			table+= "<td>";
			table+= cells[j];
			table+= "</th>";
		}
		table += "</tr>";
	}
	table += "</table>";

	$("#parsed_csv_list").html(table);
}

function displayFileData(numRows) {
	let element = document.getElementById('numberOfRows');
	element.innerHTML = numRows;
}

function displaySuccessMessage(data) {

	let element = document.getElementById('alert');

	if (element.classList.contains('d-none')) {
		element.classList.remove('d-none');
	}

	let src = document.getElementById('srcFile');
	src.innerHTML = data.fileName;

	setTimeout(hideAlert, 5000);

	function hideAlert() {

		let element = document.getElementById('alert');

		if (!element.classList.contains('d-none')) {
			element.classList.add('d-none');
		}

	}





}