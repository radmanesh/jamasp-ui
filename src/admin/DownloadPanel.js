import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import React, { Fragment } from 'react';
import { downloadSensors as sensorsList } from './utils/sensorsDownload';
import SensorDownloadSettings from './components/SensorDownloadSettings';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/**
 * 
 * @param {*} props 
 * @returns 
 */
function DownloadPanel(props) {
  const { userSensors, project } = props;

  const names = sensorsList.map((sensor) => sensor.id);
  console.log(names);
  const [sensorsName, setSensorsName] = React.useState([]);

  const sensorSettings = {
    sensorId: 'AZM_Intraday', // replace with actual sensor id
    arguments: {
      'user-id': '-', // replace with actual value
      'start-date': '2023-01-01', // replace with actual value
      'end-date': '2024-01-01', // replace with actual value
      'detail-level': '1min', // replace with actual value
    },
    parameters: {
      'timezone': 'UTC', // replace with actual value
    },
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSensorsName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };



  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >

      <FormControl sx={{ m: 1, width: 480 }}>
        <InputLabel id="sensors-multiple-checkbox-label">Sensors</InputLabel>
        <Select
          labelId="sensors-multiple-checkbox-label"
          id="sensors-multiple-checkbox"
          multiple
          value={sensorsName}
          onChange={handleChange}
          input={<OutlinedInput label="Sensors" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={sensorsName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormGroup>
        {sensorsList.map((sensor) => (
          <Fragment key={'Fragment-'+sensor.id}>
            {sensorsName?.includes(sensor.id) && (
              <SensorDownloadSettings key={sensor.id}
                sensor={sensor}
                sensorSettings={sensorSettings}
                project={project}
              />
            )}

          </Fragment>
        ))}
      </FormGroup>

    </Box>
  )
}

export default DownloadPanel;

