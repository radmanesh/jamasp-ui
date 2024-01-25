import { Autocomplete, Box, FormGroup, TextField, Typography } from '@mui/material';
import { Fragment } from 'react';
import SensorDownloadSettings from './components/SensorDownloadSettings';
import { generateSensorSettings, downloadSensors as sensorsList } from './utils/sensorsDownload';


/**
 * DownloadPanel component for managing sensor downloads.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.project - The project name.
 * @param {function} props.setSensorsName - The function to set the sensors name.
 * @param {function} props.setSensorsSettings - The function to set the sensors settings.
 * @param {Array} props.sensorsName - The array of sensors names.
 * @param {Array} props.sensorsSettings - The array of sensors settings.
 * @returns {JSX.Element} The DownloadPanel component.
 */
function DownloadPanel(props) {
  const { project, setSensorsName, setSensorsSettings, sensorsName, sensorsSettings } = props;

  /**
   * 
   * @param {*} event  event.target.name = argument name
   * @param {*} sensor   sensor object like admin/utills/sensorTemplate.js
   * @param {*} settingType   argument or parameter
   */
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
    console.log("setting new settings", sensorsSettings, newSettings);
    setSensorsSettings(newSettings);
  }

  /**
   * 
   * @param {*} event  event.target.name = argument name
   * @param {*} name  sensor name
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

  /**
   *  Render
   */
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, mb: 2 },
      }}
      noValidate
      autoComplete="off"
    >
      <Autocomplete
        multiple
        id="sensors-multiple"
        sx={{ mb: 2 }}
        options={sensorsList}
        filterSelectedOptions
        getOptionLabel={(option) => option.id}
        value={sensorsList.filter((sensor) => sensorsName?.includes(sensor.id))}
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
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Select desired sensors"
            placeholder="Sensors"
          />
        )}
      />

      {/* 
      <FormControl sx={{ m: 1, width: 480 }}>
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
      </FormControl> 
      */}

      <FormGroup>
        {sensorsList.map((sensor) => (
          <Fragment key={'Fragment-' + sensor.id}>
            {sensorsName?.includes(sensor.id) && (
              <SensorDownloadSettings key={sensor.id}
                sensor={sensor}
                sensorSettings={sensorsSettings?.find((s) => s.sensorId === sensor.id)}
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

