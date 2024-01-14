import { Alert, Box, Button, Container, LinearProgress, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Timestamp, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { db } from '../firebase';
import DataSettingsPanel from './DataSettingsPanel';
import DevicesPanel from './DevicesPanel';
import SensorsPanel from './SensorsPanel';
import { fetchFibbitApiData } from '../auth/api';
import { CustomTabPanel } from './CustomTabPanel';
import { getFitbitAuthState } from '../auth/FitbitAuth';

/**
 * Renders the ShowProject component.
 * This component displays project details, allows user input for devices, sensors, and settings,
 * and provides options to save the project and download it as a JSON file.
 *
 * @returns {JSX.Element} The rendered ShowProject component.
 */
const ShowProject = () => {
  const [tabValue, setTabValue] = useState(0);
  const { projectId } = useParams();
  //console.log(projectId);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDevices, setUserDevices] = useState([]);
  const [userSensors, setUserSensors] = useState([]);
  const [userSettings, setUserSettings] = useState({});
  const [alert, setAlert] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  
  const user = useContext(AuthContext);

  useEffect(() => {
      console.log(user);
    }, []
  );

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
   * Retrieves project data from Firestore.
   * 
   * @return {void}
   */
  useEffect(() => {
    const query = doc(db, "projects", projectId);

    const unsubscribe = onSnapshot(query, (doc) => {
      if (doc.exists()) {
        setProject(doc.data());
        console.log('project found:', doc.data());
        setUserDevices(doc.data().devices);
        setUserSensors(doc.data().sensors);
        setUserSettings(doc.data().settings);
        setIsLoading(false);
        //console.log(userDevices, userSensors, userSettings);
      } else {
        setAlert({ type: 'error', message: `Project with id: ${projectId} could not be found!` });
        setProject(null);
      }
    });

    return unsubscribe;
  }, [projectId]);

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
    console.log("handleDownload", project, user );
    const fitbitToken = await getFitbitAuthState(user.uid)
    console.log("fitbitToken", fitbitToken);
    const result = fetchFibbitApiData({ fitibitToken: fitbitToken, project: project, updateResponses: setApiResponse });
    console.log("result: ", result);
    const jsonOutput = handleGenerateJsonDownload(result, `${project.name}-${Date.now()}.json`);
    console.log("jsonOutput: ", jsonOutput);


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
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <DevicesPanel project={project} onUserInput={handleUserDevicesInput} userDevices={userDevices} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <SensorsPanel project={project} onUserInput={handleUserSensorsInput} userSensors={userSensors} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        <DataSettingsPanel project={project} onDateChange={handleDateChange} onUserInput={handleUserSettingsInput} userSettings={userSettings} />
      </CustomTabPanel>

      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ pt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSaveProject}>Save</Button>
        <Button variant="contained" color="secondary" onClick={handleDownload}>Download</Button>
      </Stack>


    </Container>

  );
};

export default ShowProject;
