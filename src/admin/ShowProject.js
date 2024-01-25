import { Alert, Box, Button, Container, LinearProgress, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Timestamp, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { fetchFibbitApiData } from '../auth/api';
import { db } from '../firebase';
import DataSettingsPanel from './DataSettingsPanel';
import DevicesPanel from './DevicesPanel';
import DownloadPanel from './DownloadPanel';
import { ProjectTabPanel } from './ProjectTabPanel';
import SensorsPanel from './SensorsPanel';
import { generateSensorSettings, downloadSensors as sensorsList } from './utils/sensorsDownload';
import { set } from 'lodash';

/**
 * Renders the ShowProject component.
 * This component displays project details, allows user input for devices, sensors, and settings,
 * and provides options to save the project and download it as a JSON file.
 *
 * @returns {JSX.Element} The rendered ShowProject component.
 */
const ShowProject = () => {
  // Tab value which is used to display the correct tab
  const [tabValue, setTabValue] = useState(0);
  // Get projectId from the URL
  const { projectId } = useParams();
  // Project working with
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Devices selected for the project to fetch data from
  const [userDevices, setUserDevices] = useState([]);
  // Sensors selected for the project to fetch data from fitbit
  // This is for the autamatic fetch job of the project
  const [userSensors, setUserSensors] = useState([]);
  // Settings for the selected sensors for the automatic fetch job
  const [userSettings, setUserSettings] = useState({});
  // Sensors selected for the project to download data from fitbit
  const [sensorsName, setSensorsName] = React.useState([]);
  // Settings for the selected sensors for the download job
  const [sensorsSettings, setSensorsSettings] = React.useState([]);

  // Alerts to display to the user
  const [alert, setAlert] = useState(null);
  // Api responses fetched from fitbit
  const [apiResponse, setApiResponse] = useState(null);
  // User object from the AuthContext set in App.js
  const {user , loading} = useContext(AuthContext);


  useEffect(() => {
    console.log("user: ", user);
    console.log("loading: ", loading);
}, []);

  /**
   * Just for debugging purposes.
   */
  useEffect(() => {
    console.log("Api responses: ", apiResponse);
  }, [apiResponse]
  );

  /**
   * updates sensors download settings object only if sensors where selected or deselected
   */
  useEffect(() => {
    let newSensorsSettings = sensorsSettings?.map((s) => ({ ...s, enabled: sensorsName.indexOf(s.sensorId) > -1 }));
    sensorsName?.forEach((sensorId) => {
      if (newSensorsSettings?.findIndex((s) => s.sensorId === sensorId) === -1) {
        newSensorsSettings.push(generateSensorSettings(sensorsList.find((s) => s.id === sensorId)));
      }
    });
    setSensorsSettings(newSensorsSettings);
  }, [sensorsName]);

  /**
   * Retrieves project data from Firestore and updates the state on startup.
   * 
   * @return {void}
   */
  useEffect(() => {
    const query = doc(db, "projects", projectId);

    const unsubscribe = onSnapshot(query, (doc) => {
      if (doc.exists()) {
        setIsLoading(true);
        setProject(doc.data());
        console.log('project found:', doc.data());
        setUserDevices(doc.data().devices);
        setUserSensors(doc.data().sensors);
        setUserSettings(doc.data().settings);
        setSensorsName(doc.data()?.downloadSettings?.filter((s) => s.enabled).map((s) => s.sensorId));
        setSensorsSettings(doc.data().downloadSettings);
        setIsLoading(false);
        //console.log(userDevices, userSensors, userSettings);
      } else {
        setAlert({ type: 'error', message: `Project with id: ${projectId} could not be found!` });
        setProject(null);
      }
    });

    return unsubscribe;
  }, [projectId]);

  /**
   * Handles the user devices input.
   * @param {string} name - The name of the device.
   * @param {boolean} checked - The checked state of the device.
   */
  const handleUserDevicesInput = (name, checked) => {
    setUserDevices(
      checked
        ? [...userDevices, name]
        : userDevices.filter((device) => device !== name)
    );
  }

  /**
   * Handles the user's sensor input.
   *
   * @param {string} name - The name of the sensor.
   * @param {boolean} checked - Indicates whether the sensor is checked or not.
   * @return {void} 
   */
  const handleUserSensorsInput = (name, checked) => {
    setUserSensors(
      checked
        ? [...userSensors, name]
        : userSensors.filter((sensor) => sensor !== name)
    );
  }

  /**
   * Updates the user settings with the provided name and value.
   * 
   * @param {string} name - The name of the setting to update.
   * @param {any} value - The new value for the setting.
   * @return {void}
  */
  const handleUserSettingsInput = (name, value) => {
    // Update the user settings object with the new name and value
    setUserSettings({
      ...userSettings,
      [name]: value,
    });
  }
  /**
   * Handles the date change event and updates the user settings.
   * 
   * @param {string} name - The name of the date field.
   * @param {any} value - The new value for the date field.
   * @return {void}
   */
  const handleDateChange = (name, value) => {
    console.log(name, value, value.type);
    setUserSettings({
      ...userSettings,
      dateRange: {
        ...userSettings.dateRange,
        [name]: value,
      },
    });
  }

  /**
   * handles the tab change event and updates the tab value.
   * @param {*} event  event.target.name = argument name
   * @param {*} newValue new tab value
   */
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  /**
   * Handles saving the project by updating the project document with the new user devices, sensors, and settings.
   *
   * @return {void} No return value.
   */
  const handleSaveProject = () => {
    setIsLoading(true);
    try {
      // Update the project document with the new user devices, sensors, and settings
      const updatedProject = {
        ...project,
        devices: userDevices,
        sensors: userSensors,
        settings: userSettings,
        downloadSettings: sensorsSettings,
        updatedAt: Timestamp.now(),
      }
      console.log("updatedProject: ", updatedProject);
      const projectRef = doc(db, "projects", projectId);
      updateDoc(projectRef, updatedProject).then(() => {
        setProject(updatedProject);
        setAlert({ type: 'success', message: `Project ${updatedProject.name} with id: ${projectId} updated successfully` });
        setTimeout(() => setAlert(null), 5000); // Hide the alert after 5 seconds
        //console.log("Project updated successfully");
      }).catch((error) => {
        setAlert({ type: 'error', message: `Project ${updatedProject.name} with id: ${projectId} could not be updated!!!!` });
        setTimeout(() => setAlert(null), 5000); // Hide the alert after 5 seconds
        console.error("Error updating project: ", error);
      })
    } catch (error) {
      setAlert({ type: 'error', message: `Project with id: ${projectId} could not be updated!!!!` });
      setTimeout(() => setAlert(null), 5000); // Hide the alert after 5 seconds
      console.error("Error updating project: ", error);
    }
    setIsLoading(false);
  }

  /**
   * Handle the download of the project as a JSON file.
   */
  const handleDownload = async () => {
    setIsLoading(true);
    console.log("handleDownload", project, user);
    // const ownerUserId = await getUserIdByFitbitId('BPCPPB');
    // console.log("ownerUserId", ownerUserId);
    // const fitbitToken = await getFitbitAuthState(ownerUserId);
    // console.log("fitbitToken", fitbitToken);
    const responses = await fetchFibbitApiData({ project: project, updateResponses: setApiResponse });
    console.log("result: ", responses);
    if (responses) {
      responses.forEach(element => {
        console.log(element);
        console.log(typeof element);
      });
    }
    //const jsonOutput = handleGenerateJsonDownload(result, `${project.name}-${Date.now()}.json`);
    //console.log("jsonOutput: ", jsonOutput);
    setIsLoading(false);
  }

  const handleGenerateJsonDownload = (data, fileName) => {
    // create file in browser
    if (fileName === '') {
      fileName = 'output.json';
    }
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    return;
  };

  /**
   * Returns the accessibility properties for a tab.
   *
   * @param {number} index - The index of the tab.
   * @returns {Object} - The accessibility properties object.
   */
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }



  /**
   * Renders the project page.
   *
   * @returns {JSX.Element} - The rendered project page.
   */
  return (
    <Container maxWidth="lg">
      <Typography variant="h3">{project?.name}</Typography>

      {isLoading && <LinearProgress />}
      {alert && <Alert severity={alert.type}>{alert.message}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Devices" {...a11yProps(0)} />
          <Tab label="Sensors" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
          <Tab label="Download" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <ProjectTabPanel value={tabValue} index={0}>
        <DevicesPanel project={project} onUserInput={handleUserDevicesInput} userDevices={userDevices} />
      </ProjectTabPanel>
      <ProjectTabPanel value={tabValue} index={1}>
        <SensorsPanel project={project} onUserInput={handleUserSensorsInput} userSensors={userSensors} />
      </ProjectTabPanel>
      <ProjectTabPanel value={tabValue} index={2}>
        <DataSettingsPanel project={project} onDateChange={handleDateChange} onUserInput={handleUserSettingsInput} userSettings={userSettings} />
      </ProjectTabPanel>
      <ProjectTabPanel value={tabValue} index={3}>
        <DownloadPanel project={project} setSensorsName={setSensorsName} sensorsName={sensorsName} sensorsSettings={sensorsSettings} setSensorsSettings={setSensorsSettings} />
      </ProjectTabPanel>

      {apiResponse &&
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">API Responses</Typography>
          <pre>Number of responses: {apiResponse.length}</pre>
          <Button variant="contained" color="secondary" onClick={() => handleGenerateJsonDownload(apiResponse, `${project.name}-${Date.now()}`)}>Download</Button>
        </Paper>
      }

      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ pt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSaveProject}>Save</Button>
        <Button variant="contained" color="secondary" onClick={handleDownload}>Download</Button>
      </Stack>


    </Container>

  );
};

export default ShowProject;
