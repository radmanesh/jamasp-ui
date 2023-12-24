import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import DevicesPanel from './DevicesPanel';
import SensorsPanel from './SensorsPanel';
import DataSettingsPanel from './DataSettingsPanel';

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
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h3">Project 1</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Devices" {...a11yProps(0)} />
          <Tab label="Sensors" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DevicesPanel />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SensorsPanel /> 
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DataSettingsPanel />
      </CustomTabPanel>


    </Container>
      
  );
};

export default ShowProject;
