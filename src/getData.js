//const data = require('./public/uploads/finals/palma/json/palma.json');
const axios = require("axios");


init().then(() => {
    console.log("ya estoy :)")
});
/*
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

}*/

async function init(){
    await axios.get('http://localhost:4000/v1/id/62b9bf36a58d3b80755292af').then(response=>{
        console.log(response.data);
    });
}

