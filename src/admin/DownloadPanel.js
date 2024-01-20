import { Autocomplete, Box, FormGroup, TextField, Typography } from '@mui/material';
import React, { Fragment, useEffect } from 'react';
import SensorDownloadSettings from './components/SensorDownloadSettings';
import { downloadSensors as sensorsList } from './utils/sensorsDownload';



// Sensor settings template
const sensorsSettingsTemplate = [
  {
    sensorId: 'AZM_Intraday',
    arguments: {
      'user-id': '-',
      'start-date': '2023-01-01',
      'end-date': '2024-01-01',
      'detail-level': '1min',
    },
    parameters: {
      'timezone': 'UTC',
    },
    enabled: true,
  },
  {
    sensorId: 'Activity_steps_Intraday',
    arguments: {
      'user-id': '-',
      'start-date': '2023-01-01',
      'end-date': '2024-01-01',
      'detail-level': '1min',
    },
    parameters: {
      'timezone': 'UTC',
    },
    enabled: true,
  }
];

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
  const { project } = props;

  const names = sensorsList.map((sensor) => sensor.id);
  const [sensorsName, setSensorsName] = React.useState([]);
  const [sensorsSettings, setSensorsSettings] = React.useState([]);

  const handleSensorSettingsChange = (event, sensor, settingType) => {
    let { name, value } = event.target;

    //console.log("handleSensorSettingsChange",name,value);
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    }

    let newSettings;
    let sensorConfig = sensorsSettings.find(item => item.sensorId === sensor.id);
    //console.log("found sensorConfig", sensorConfig);
    if (sensorConfig === null || sensorConfig === undefined) {
      sensorConfig = generateSensorSettings(sensor);
      if (settingType === 'argument') {
        sensorConfig.arguments[name] = value;
      } else if (settingType === 'parameter') {
        sensorConfig.parameters[name] = value;
      }
      newSettings = [...sensorsSettings, { sensorConfig }];
    } else {
      newSettings = sensorsSettings.map(item => {
        if (item.sensorId === sensor.id) {
          if (settingType === 'argument') {
            item.arguments[name] = value;
          } else if (settingType === 'parameter') {
            item.parameters[name] = value;
          }
        }
        return item;
      });
    }
    //console.log("setting new settings",newSettings,newSettings.map(item => item.arguments));
    setSensorsSettings(newSettings);
  }


  function generateSensorSettings(sensor) {
    if (sensor === null || sensor === undefined) {
      return null;
    }
    const sensorSettings = {
      sensorId: sensor.id,
      arguments: sensor.arguments.reduce((name, val) => ({ ...name, [`${val.name}`]: val.defaultValue }), {}),
      parameters: sensor.parameters.reduce((name, val) => ({ ...name, [`${val.name}`]: val.defaultValue }), {}),
      enabled: true,
    };
    return sensorSettings
  }

  useEffect(() => {
    let newSensorsSettings = sensorsSettings.map((s) => ({ ...s, enabled: sensorsName.indexOf(s.sensorId) > -1 }));
    sensorsName.forEach((sensorId) => {
      if (newSensorsSettings.findIndex((s) => s.sensorId === sensorId) === -1) {
        newSensorsSettings.push(generateSensorSettings(sensorsList.find((s) => s.id === sensorId)));
      }
    });
    setSensorsSettings(newSensorsSettings);
  }, [sensorsName]);

  /**
   * 
   * @param {*} event 
   * @param {*} name 
   */
  const handleChange = (event) => {
    console.log("handleChange", event);
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
        '& .MuiTextField-root': { m: 1 , mb: 2 },
      }}
      noValidate
      autoComplete="off"
    >
      <Autocomplete
        multiple
        id="sensors-multiple"
        sx={{ mb: 2}}
        options={sensorsList}
        getOptionLabel={(option) => option.id}
        onChange={(e, newValue) => {
          const event = {
            target: {
              value: newValue.map((item) => item.id)
            }
          };
          handleChange(event);
        }}
        renderOption={(props, option) => (
          <Box component="li"  {...props}>
            <Typography variant="body1">
              <b>{option.label}</b> : {option.description}
            </Typography>
          </Box>
        )}
        defaultValue={[]}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Select desired sensors"
            placeholder="Sensors"
          />
        )}
      />

      {/* <FormControl sx={{ m: 1, width: 480 }}>
        <InputLabel id="sensors-multiple-checkbox-label">Sensors</InputLabel>
        <Select
          labelId="sensors-multiple-checkbox-label"
          id="sensors-multiple-checkbox"
          multiple
          onChange={handleChange}
          value={sensorsName}
          input={<OutlinedInput label="Sensors" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name} >
              <Checkbox checked={sensorsName.indexOf(name) > -1} name={name} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      <FormGroup>
        {sensorsList.map((sensor) => (
          <Fragment key={'Fragment-' + sensor.id}>
            {sensorsName?.includes(sensor.id) && (
              <SensorDownloadSettings key={sensor.id}
                sensor={sensor}
                sensorSettings={sensorsSettings.find((s) => s.sensorId === sensor.id)}
                project={project}
                handleSettingsChange={handleSensorSettingsChange}
                handleRemoveSensor={(sensorId) => {
                  setSensorsName(sensorsName.filter((name) => name !== sensorId));
                }}
              />
            )}

          </Fragment>
        ))}
      </FormGroup>

    </Box>
  )
}

export default DownloadPanel;

