// *****************************************************************************************
//todo: come up a with a better strucure to handle fitbit auth , context and apis. in different modules. they are all mixed up here.
// *****************************************************************************************

/**
 * Fetches Fitbit API data using the provided Fitbit token and project information.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.fitibitToken - The Fitbit token object.
 * @param {Object} options.project - The project object.
 */
import axios from 'axios';
import { sensors as sensorsList } from '../admin/sensors';
import moment from 'moment';

const serviceBaseUrl = 'https://fitbit-oauth-service-rxexpcoyba-ue.a.run.app/'
const getTokenUrl = serviceBaseUrl + 'getToken'; //'http://getFitbitToken-jw3n47gu5q-uc.a.run.app';
const refershTokenUrl = serviceBaseUrl + 'refreshToken'; //'https://refreshFitbitToken-jw3n47gu5q-uc.a.run.app';
const fitbitApiBaseUrl = 'https://api.fitbit.com';

const generateAPIEndpoint = (sensor, parameters) => {
	let apiParams = Object.assign({}, ...sensor.arguments.map((arg, index) => {
		let value = parameters[arg] ? parameters[arg] : sensor.defaultValues[index];
		if ((arg === 'start-date' || arg === 'end-date') && value.toDate) {
			value = moment(value.toDate()).format('MM-DD-YYYY');
		}
		return { [arg]: value };
	}));
	console.log("apiParams: ", apiParams);

	const newStr = fitbitApiBaseUrl + sensor.link.replace(/\[(.*?)\]/g, (match, p1) => apiParams[p1]);
	console.log("result", newStr);
	return newStr;
}

const getProjectEndopoints = (project) => {
	const apiEndpoints = [];
	project.devices.forEach((device) => {
		const selectedSensors = sensorsList.filter((item) => project.sensors.includes(item.id));
		console.log("selectedSensors: ", selectedSensors);
		selectedSensors.forEach((sensor) => {
			apiEndpoints.push(generateAPIEndpoint(sensor, { 'user-id': device, 'start-date': project.settings.dateRange.from, 'end-date': project.settings.dateRange.to, 'detail-level': project.settings.detailLevel }));
		});
	});
	return apiEndpoints;
}


const fetchFibbitApiData = async ({ fitibitToken, project, updateResponses }) => {
	console.log({fitibitToken, project});
	if (!fitibitToken) {
		console.error('No Fitbit token was provided.');
		return null;
	}

	// Create a config object with the access token
	const config = {
		headers: { Authorization: `Bearer ${fitibitToken.access_token}` },
	};
	const apiEndpoints = getProjectEndopoints(project);
	const requests = [];
	apiEndpoints.forEach((endpoint) => {
		requests.push(axios.get(endpoint, config));
	});

	// axios
	// 	.all(requests)
	// 	.then(
	// 		axios.spread((...responses) => {
	// 			console.log("responses: ", responses);
	// 			return responses;
	// 		})
	// 	)
	// 	.catch((errors) => {
	// 		console.log(errors.toJSON());
	// 		return null;
	// 	});
	Promise.allSettled(requests).then((results) => {
		console.log("results: ", results);
		const data = [];
		results.forEach((result) => {
			if (result.status === 'fulfilled') {
				data.push(result.value.data);
			}
		});
		console.log("data: ", data);
		updateResponses(data);
		return data;
	});

}

/**
 * Retrieves or renews an access token.
 *
 * @param {string} type - The type of request ('get' or 'renew').
 * @param {string} code - The code parameter.
 * @param {string} verifier - The code verifier parameter.
 * @return {Promise<Object>} - A Promise that resolves to the token information object.
 */
async function getOrRenewAccessToken(type, code, verifier) {
	let url;
	url = ((type === 'get') ? getTokenUrl : refershTokenUrl) + '/?code=' +
		code + '&code_verifier=' + verifier;

	// Use Axios to make a GET request to the endpoint
	const tokenInfo = await axios.get(url);
	console.log(tokenInfo.data);

	// Save tokens to localStorage together with a timestamp
	localStorage.setItem('code', code);
	localStorage.setItem('code_verifier', verifier);
	localStorage.setItem('access_token', tokenInfo.data.access_token);
	localStorage.setItem('refresh_token', tokenInfo.data.refresh_token);
	localStorage.setItem('last_saved_time', Date.now());
	return tokenInfo.data;
}
export { getOrRenewAccessToken , fetchFibbitApiData };
