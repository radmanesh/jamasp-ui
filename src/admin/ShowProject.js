import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DataSettingsPanel from './DataSettingsPanel';
import DevicesPanel from './DevicesPanel';
import SensorsPanel from './SensorsPanel';
import { db } from '../firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ShowProject = () => {
  const [tabValue, setTabValue] = useState(0);
  const { projectId } = useParams();
  console.log(projectId);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const query = doc(db, "projects", projectId);

    const unsubscribe = onSnapshot(query, (doc) => {
      if (doc.exists()) {
        setProject(doc.data());
      } else {
        setProject(null);
      }
    });

    return unsubscribe;
  }, [projectId]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h3">{project?.name}</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Devices" {...a11yProps(0)} />
          <Tab label="Sensors" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <DevicesPanel project={project} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <SensorsPanel  project={project} /> 
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        <DataSettingsPanel  project={project} />
      </CustomTabPanel>


    </Container>
      
  );
};

export default ShowProject;
