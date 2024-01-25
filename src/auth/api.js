// *****************************************************************************************
//todo: come up a with a better strucure to handle fitbit auth , context and apis. in different modules. they are all mixed up here.
// TODO: use some hook to update rate limit in firestore
// *****************************************************************************************

/**
 * Fetches Fitbit API data using the provided Fitbit token and project information.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.fitibitToken - The Fitbit token object.
 * @param {Object} options.project - The project object.
 */
import axios from 'axios';
//import { sensors as sensorsList } from '../admin/utils/sensors';
import { downloadSensors } from '../admin/utils/sensorsDownload';
import moment from 'moment';
import { getUserIdByFitbitId } from './FitbitAuthUtils';
import { getFitbitAuthState } from './FitbitAuth';

const serviceBaseUrl = 'https://fitbit-oauth-service-rxexpcoyba-ue.a.run.app/'
const getTokenUrl = serviceBaseUrl + 'getToken'; //'http://getFitbitToken-jw3n47gu5q-uc.a.run.app';
const refershTokenUrl = serviceBaseUrl + 'refreshToken'; //'https://refreshFitbitToken-jw3n47gu5q-uc.a.run.app';
const fitbitApiBaseUrl = 'https://api.fitbit.com';

/**
 * Generates an API endpoint URL based on the provided sensor and sensor settings.
 * @param {Object} sensor - The sensor object.
 * @param {Object} sensorSettings - The sensor settings object.
 * @returns {string} The generated API endpoint URL.
 */
function generateAPIEndpointFromDownloadSensor(sensor, sensorSettings) {
	let apiParams = Object.assign({}, ...sensor.arguments.map((arg, index) => {
		let value = sensorSettings.arguments[arg] ? sensorSettings.arguments[arg] : sensor.defaultValues[index];
		// if ((arg === 'start-date' || arg === 'end-date') && value.toDate) {
		// 	value = moment(value.toDate()).format('YYYY-MM-DD');
		// }
		return { [arg]: value };
	}));

	const endpointUrl = fitbitApiBaseUrl + sensor.link.replace(/\[(.*?)\]/g, (match, p1) => apiParams[p1]);
	console.log("result", endpointUrl);
	
	return endpointUrl;
}

/**
 * Generates an Axios configuration object from the download sensor data.
 * @param {string} fitibitToken - The Fitbit access token.
 * @param {string} sensor - The sensor data.
 * @param {object} sensorSettings - The sensor settings.
 * @returns {object} The Axios configuration object.
 */
function generateAxiosConfigFromDownloadSensor(fitibitToken, sensor , sensorSettings) {
	const config = {
		headers: { Authorization: `Bearer ${fitibitToken.access_token}` },
	};
	if(sensorSettings.parameters){
		sensorSettings.parameters.forEach((param) => {
			config.params = {...config.params, ...param};
		});
	}
	console.log("config: ", config);
	return config;
}


/**
 * Generates an API endpoint URL based on the given sensor and parameters.
 * This is used for downloading automatically scheduled data fetching.
 * @param {Object} sensor - The sensor object containing information about the API endpoint.
 * @param {Object} parameters - The parameters to be included in the API endpoint URL.
 * @returns {string} The generated API endpoint URL.
 */
const generateAPIEndpoint = (sensor, parameters) => {
	let apiParams = Object.assign({}, ...sensor.arguments.map((arg, index) => {
		let value = parameters[arg] ? parameters[arg] : sensor.defaultValues[index];
		if ((arg === 'start-date' || arg === 'end-date') && value.toDate) {
			value = moment(value.toDate()).format('YYYY-MM-DD');
		}
		return { [arg]: value };
	}));
	//console.log("apiParams: ", apiParams);

	const endpointUrl = fitbitApiBaseUrl + sensor.link.replace(/\[(.*?)\]/g, (match, p1) => apiParams[p1]);
	//console.log("result", endpointUrl);
	
	return endpointUrl;
}

/**
 * Generates an Axios configuration object for making API requests.
 * This is used for downloading automatically scheduled data fetching.
 * @param {Object} fitibitToken - The Fitbit access token.
 * @param {Object} sensor - The sensor object.
 * @returns {Object} The Axios configuration object.
 */
const generateAxiosConfig = (fitibitToken, sensor) => {
	const config = {
		headers: { Authorization: `Bearer ${fitibitToken.access_token}` },
	};
	if(sensor.parameters){
		sensor.parameters.forEach((param) => {
			config.params = {...config.params, ...param};
		});
	}
	console.log("config: ", config);
	return config;
}



/**
 * Fetches data from the Fitbit API for a given project.
 * @param {Object} options - The options for fetching the data.
 * @param {Object} options.project - The project object containing information about the project.
 * @param {Function} options.updateResponses - The function to update the responses with the fetched data.
 * @returns {Promise<Array>} - A promise that resolves to an array of fetched data.
 */
const fetchFibbitApiData = async ( {project, updateResponses }) => {
	console.log({"project": project});
	if (!project ) {
		console.error('No Fitbit token was provided.');
		return null;
	}

	const apiEndpoints = [];
	for (const device of project.devices) {
		const deviceGoogleUserId = await getUserIdByFitbitId(device);
		console.log("deviceGoogleUserId: ", deviceGoogleUserId);
		const fitbitToken = await getFitbitAuthState(deviceGoogleUserId);
		console.log("fitbitToken: ", fitbitToken);
		const sensorsToDownload = downloadSensors.filter(sensor => 
			project.downloadSensors.some(setting => setting.sensorId === sensor.id)
		);
		console.log("sensorsToDownload: ", sensorsToDownload);

		sensorsToDownload.forEach((sensor) => {
			const apiEndpoint = { 
				//endpointUrl: generateAPIEndpoint(sensor, { 'user-id': device, 'start-date': project.settings.dateRange.from, 'end-date': project.settings.dateRange.to, 'detail-level': project.settings.detailLevel }),
				endpointUrl: generateAPIEndpointFromDownloadSensor(sensor, project.downloadSensors.find(sd => sd.sensorId === sensor.id)),
				axiosConfig: generateAxiosConfigFromDownloadSensor(fitbitToken, sensor , project.downloadSensors.find(sd => sd.sensorId === sensor.id)) 
			};
			apiEndpoints.push(apiEndpoint);
		});
	}
	console.log("apiEndpoints: ", apiEndpoints);

	const requests = [];
	apiEndpoints.forEach((endpoint) => {
		requests.push(axios.get(endpoint.endpointUrl, endpoint.axiosConfig));
	});

	// Use Promise.allSettled to make sure all requests are completed
	Promise.allSettled(requests).then((results) => {
		console.log("results: ", results);
		const data = [];
		let rateLimit = {};
		results.forEach((result) => {
			if (result.status === 'fulfilled') {
				// get Fitbit-Rate-Limit-Limit from response headers
				try {
					rateLimit = {
						rateLimit: result.value.headers['Fitbit-Rate-Limit-Limit'],
						rateLimitRemaining: result.value.headers['Fitbit-Rate-Limit-Remaining'],
						rateLimitReset: result.value.headers['Fitbit-Rate-Limit-Reset']
					};					
				} catch (error) {
					console.log("error: ", error);
					console.log("result.value.headers: ", result.value.headers);
				}
				data.push(result.value.data);
			}
		});
		// save rate limit to firestore
		console.log("rateLimit: ", rateLimit);
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
