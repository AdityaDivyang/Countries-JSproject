'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
	const html = `
            <article class="country ${className}">
                <img class="country__img" src="${data.flag}" />
                <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(
					+data.population / 1000000
				).toFixed(1)} M people</p>
                <p class="country__row"><span>🗣️</span>${
					data.languages[0]['name']
				}</p>
                <p class="country__row"><span>💰</span>${
					data.currencies[0]['name']
				}</p>
                </div>
            </article>
        `;
	countriesContainer.insertAdjacentHTML('beforeend', html);
	countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
	countriesContainer.insertAdjacentText('beforeend', msg);
	countriesContainer.style.opacity = 1;
};
///////////////////////////////////////
// const getCountryData = function (country) {
// 	const request = new XMLHttpRequest();
// 	request.open(
// 		'GET',
// 		`https://restcountries.eu/rest/v2/name/${country}?fullText=true`
// 	);
// 	request.send();
// 	request.addEventListener('load', function () {
// 		const [data] = JSON.parse(this.responseText);
// 		console.log(data);
// 		const html = `
//             <article class="country">
//                 <img class="country__img" src="${data.flag}" />
//                 <div class="country__data">
//                 <h3 class="country__name">${data.name}</h3>
//                 <h4 class="country__region">${data.region}</h4>
//                 <p class="country__row"><span>👫</span>${(
// 					+data.population / 1000000
// 				).toFixed(1)} M people</p>
//                 <p class="country__row"><span>🗣️</span>${
// 					data.languages[0]['name']
// 				}</p>
//                 <p class="country__row"><span>💰</span>${
// 					data.currencies[0]['name']
// 				}</p>
//                 </div>
//             </article>
//         `;
// 		countriesContainer.insertAdjacentHTML('beforeend', html);
// 		countriesContainer.style.opacity = 1;
// 	});
// };
// getCountryData('india');
// getCountryData('usa');

// const getCountryAndNeighbour = function (country) {
// 	// AJAX call country 1
// 	const request = new XMLHttpRequest();
// 	request.open(
// 		'GET',
// 		`https://restcountries.eu/rest/v2/name/${country}?fullText=true`
// 	);
// 	request.send();
// 	request.addEventListener('load', function () {
// 		const [data] = JSON.parse(this.responseText);
// 		console.log(data);

// 		// Render Country 1
// 		renderCountry(data);

// 		// Get Neighbouring Country 2
// 		const [neighbour] = data.borders;
// 		if (!neighbour) return;
// 		const request2 = new XMLHttpRequest();
// 		request2.open(
// 			'GET',
// 			`https://restcountries.eu/rest/v2/alpha/${neighbour}?fullText=true`
// 		);
// 		request2.send();
// 		request2.addEventListener('load', function () {
// 			const data2 = JSON.parse(this.responseText);
// 			console.log(data2);
// 			renderCountry(data2, 'neighbour');
// 		});
// 	});
// };
// getCountryAndNeighbour('india');

// const request = new XMLHttpRequest();
// 	request.open(
// 		'GET',
// 		`https://restcountries.eu/rest/v2/name/${country}?fullText=true`
// 	);
// 	request.send();

// const request = fetch(
// 	'https://restcountries.eu/rest/v2/name/india?fullText=true'
// );
// console.log(request);

// const getJSON = function (url, errorMSG) {
// 	return fetch(url).then(response => {
// 		if (!response.ok) throw new Error(`${errorMSG} (${response.status})`);
// 		return response.json();
// 	});
// };

// const getCountryData = function (country) {
// 	// AJAX call country 1
// 	getJSON(
// 		`https://restcountries.eu/rest/v2/name/${country}?fullText=true`,
// 		'Country not found'
// 	)
// 		.then(data => {
// 			renderCountry(data[0]);
// 			const neighbour = data[0].borders[0];
// 			if (!neighbour) throw new Error('No neighbour found!');

// 			// Country 2
// 			return getJSON(
// 				`https://restcountries.eu/rest/v2/alpha/${neighbour}`,
// 				'Country not found'
// 			);
// 		})
// 		.then(data => renderCountry(data, 'neighbour'))
// 		.catch(err => {
// 			console.error(`${err} is the error`);
// 			renderError(`Something went wrong : ${err.message}`);
// 		})
// 		.finally(() => {
// 			countriesContainer.style.opacity = 1;
// 		});
// };

// btn.addEventListener('click', function () {
// 	getCountryData('india');
// 	btn.style.display = 'none';
// });

const getPosition = function () {
	return new Promise(function (resolve, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
};

const whereAmI = async function () {
	try {
		// Geolocation : getting coordinates
		const {
			coords: { latitude: lat, longitude: lng },
		} = await getPosition();

		// Reverse Geocoding
		const resGeo = await fetch(
			`https://geocode.xyz/${lat},${lng}?geoit=json`
		);
		if (!resGeo.ok)
			throw new Error(`Problem getting location data : ${resGeo.status}`);
		const dataGeo = await resGeo.json();

		// Country data
		const res = await fetch(
			`https://restcountries.eu/rest/v2/name/${dataGeo.country}?fullText=true`
		);
		if (!res.ok)
			throw new Error(`Problem getting country data : ${res.status}`);
		const [data] = await res.json();

		// Rendering Country
		renderCountry(data);
		return `You are in ${dataGeo.city} ${dataGeo.country}`;
	} catch (err) {
		console.log(`An error ocurred: ${err}`);
		renderError(`Something went wrong : ${err.message}`);
		throw err;
	}
};
// whereAmI()
// 	.then(data => console.log(data))
// 	.catch(err => console.error(err));
(async function () {
	try {
		const data = await whereAmI();
		console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
console.log('First');

// (async function () {
// 	const [res] = await Promise.race([
// 		getJSON(`https://restcountries.eu/rest/v2/name/italy?fullText=true`),
// 		getJSON(`https://restcountries.eu/rest/v2/name/egypt?fullText=true`),
// 		getJSON(`https://restcountries.eu/rest/v2/name/mexico?fullText=true`),
// 	]);
// 	console.log(res);
// })();

// const timeout = function (s) {
// 	return new Promise(function (_, reject) {
// 		setTimeout(function () {
// 			reject(new Error('Request took too long!'));
// 		}, s * 1000);
// 	});
// };

// Promise.race([
// 	getJSON(`https://restcountries.eu/rest/v2/name/italy?fullText=true`),
// 	timeout(1),
// ])
// 	.then(res => console.log(res[0]))
// 	.catch(err => console.error(err));
