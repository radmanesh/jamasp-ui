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
function generateAPIEndpointFromDownloadSettings(sensor, sensorSettings) {
	let apiParams = Object.assign({}, ...sensor.arguments.map((arg, index) => {
		console.log("arg: ", arg);
		let value = sensorSettings.arguments[arg.name] ? sensorSettings.arguments[arg.name] : sensor.defaultValues[index];
		// if ((arg === 'start-date' || arg === 'end-date') && value.toDate) {
		// 	value = moment(value.toDate()).format('YYYY-MM-DD');
		// }
		return { [arg.name]: value };
	}));

	const endpointUrl = fitbitApiBaseUrl + sensor.link.replace(/\[(.*?)\]/g, (match, p1) => apiParams[p1]);
	//console.log("result", endpointUrl);

	return endpointUrl;
}

/**
 * Generates an Axios configuration object from the download sensor data.
 * @param {string} fitibitToken - The Fitbit access token.
 * @param {string} sensor - The sensor data.
 * @param {object} sensorSettings - The sensor settings.
 * @returns {object} The Axios configuration object.
 */
function generateAxiosConfigFromDownloadSettings(fitibitToken, sensor, sensorSettings) {
	//console.log("sensorSettings: ", sensorSettings);
	const config = {
		headers: { Authorization: `Bearer ${fitibitToken.access_token}` },
	};
	if (sensorSettings !== null && sensorSettings !== undefined && sensorSettings.parameters) {
		for (const [key, value] of Object.entries(sensorSettings.parameters)) {
			config.params = { ...config.params, [key]: value };
		}
	}
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
	if (sensor.parameters) {
		sensor.parameters.forEach((param) => {
			config.params = { ...config.params, ...param };
		});
	}
	//console.log("config: ", config);
	return config;
}


const fetchFitbitApiEndpont = async (fitbitToken, edndpoint, endpointSettings) => {
	const endpointUrl = { endpointUrl: generateAPIEndpointFromDownloadSettings(edndpoint, endpointSettings), axiosConfig: generateAxiosConfigFromDownloadSettings(fitbitToken, edndpoint, endpointSettings) };
	console.log("endpointUrl: ", endpointUrl);
	axios.get(endpointUrl.endpointUrl, endpointUrl.axiosConfig).then((result) => {
		console.log("result: ", result);
		return { status: result.status, data: result.data }
	}).catch((error) => {
		console.log("error: ", error);
		return { status: error.response.status, data: error.response.data }
	});
}

/**
 * Fetches data from the Fitbit API for a given project.
 * @param {Object} options - The options for fetching the data.
 * @param {Object} options.project - The project object containing information about the project.
 * @param {Function} options.updateResponses - The function to update the responses with the fetched data.
 * @returns {Promise<Array>} - A promise that resolves to an array of fetched data.
 */
const fetchFitbitApiData = async ({ project, updateResponses, updateRateLimits, setLog }) => {
	console.log({ "project": project });
	if (!project) {
		console.error('No Fitbit token was provided.');
		return null;
	}

	const apiEndpoints = [];
	for (const device of project.devices) {
		const deviceGoogleUserId = await getUserIdByFitbitId(device);
		const fitbitToken = await getFitbitAuthState(deviceGoogleUserId);
		//console.log("deviceGoogleUserId: ", deviceGoogleUserId);		
		//console.log("fitbitToken: ", fitbitToken);
		//console.log("project.downloadSettings: ", project.downloadSettings);

		const sensorsToDownload = downloadSensors.filter(sensor =>
			project.downloadSettings.some(setting => setting.sensorId === sensor.id && setting.enabled)
		);
		//console.log("sensorsToDownload: ", sensorsToDownload);

		sensorsToDownload.forEach((sensor) => {
			const updatedSettings = project.downloadSettings.find(sd => sd.sensorId === sensor.id);
			updatedSettings.arguments['user-id'] = device;
			const apiEndpoint = {
				sensor: sensor.label,
				endpointUrl: generateAPIEndpointFromDownloadSettings(sensor, updatedSettings),
				axiosConfig: generateAxiosConfigFromDownloadSettings(fitbitToken, sensor, updatedSettings),
				projectId: project?.id ? project.id : 'null',
				date: new Date(),
				user_id: deviceGoogleUserId,
				device_id: device,
			};
			apiEndpoints.push(apiEndpoint);
		});
	}
	console.log("apiEndpoints: ", apiEndpoints);

	const requestsObjectArray = []
	apiEndpoints.forEach((endpoint) => {
		requestsObjectArray.push({
			endpoint: endpoint,
			axios_response: axios.get(endpoint.endpointUrl, endpoint.axiosConfig)
		});
	});
	const apiRequestsPromises = requestsObjectArray.map((requestObject) => requestObject.axios_response);
	const responseData = requestsObjectArray.map((requestObject) => {
		return {
			request: {
				device_id: requestObject.endpoint.device_id,
				sensor: requestObject.endpoint.sensor,
				endpointUrl: requestObject.endpoint.endpointUrl,
				date: requestObject.endpoint.date,
			},
			response: {
				status: 'pending',
				data: null
			}
		}
	});
	console.log("requestsObjectArray: ", requestsObjectArray);

	// Use Promise.allSettled to make sure all requests are completed
	Promise.allSettled(apiRequestsPromises).then((results) => {
		//console.log("results: ", results);
		results.forEach((result, index) => {
			console.log("result: ", result);
			try {
				requestsObjectArray[index].axios_response = (result.status === 'fulfilled' ? result.value.data : result.reason.response.data.errors);
				responseData[index].response = {
					status: result.status,
					data: requestsObjectArray[index].axios_response
				};
				setLog(requestsObjectArray[index]).catch((err) => {
					console.log("result: ", result);
					console.log("setting Log error: ", err);
				});
			} catch (error) {
				console.log("setting Log error: ", error);
			}
		});
		console.log("fetch promise all settled", requestsObjectArray);
		updateResponses(responseData);
	});
	console.log("here is after promise function:, ", requestsObjectArray);
	return responseData;
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
export { getOrRenewAccessToken, fetchFitbitApiData , generateAPIEndpoint, generateAxiosConfig, fetchFitbitApiEndpont };
