import axios from "axios";
import { downloadSensors, generateSensorSettings } from "../../admin/utils/sensorsDownload";
import { fetchFitbitApiEndpont } from "../api";

const fetchUserProfile = async (user) => {
  const getProfileEndpoint = downloadSensors.find((sensor) => sensor.id === 'Get_User_Profile');
  console.log("fetchUserPrile", getProfileEndpoint);
  const profileEndpointSettings = generateSensorSettings(getProfileEndpoint);
  fetchFitbitApiEndpont(user.fitbitData , getProfileEndpoint , profileEndpointSettings ).then((response) => {
    console.log("response", response);
    return response.data;
  }).catch((error) => {
    console.log("error", error);
  });
};

const fetchUserProfileNow = async (user) => {
  axios.get(`https://api.fitbit.com/1/user/-/profile.json`, {
    headers: {
      Authorization: `Bearer ${user.fitbitData.access_token}`,
    },
  }).then((response) => {
    console.log("response", response);
    return response.data;
  }).catch((error) => {
    console.log("error", error);
    return null;
  });
}

export { fetchUserProfile , fetchUserProfileNow };