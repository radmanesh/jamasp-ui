import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React from 'react';
import { sensors as sensorsList } from './sensors';

/**
 * 
 * @param {*} props 
 * @returns 
 */

function SensorsPanel(props) {
  const { userSensors, project , onUserInput } = props;

  const handleCheckboxChange = (sensorId, isChecked) => {
    onUserInput(sensorId, isChecked);
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
      <FormGroup>
        {sensorsList.map((sensor, index) => (
          <FormControlLabel
            control={<Checkbox checked={userSensors.includes(sensor.id)} onChange={(e) => handleCheckboxChange(sensor.id, e.target.checked)} />}
            key={sensor.id}
            label={sensor.label}
          />
        ))}
      </FormGroup>

    </Box>
  )
}

export default SensorsPanel;

