import React from "react";
import { Box, Typography, List, ListItem, TextField } from "@mui/material";

function SensorDownloadSettings({ sensor, sensorSettings, project }) {
  return (
    <Box>
      <Typography variant="h4">{sensor.label}</Typography>
      <Typography variant="caption">{sensor.description}</Typography>
      <Typography variant="h6" >Arguments:</Typography>
      <List>
        {sensor.arguments.map((arg, index) => (
          <ListItem key={'arg-'+index}>
            {arg.type === 'text' && (
              <TextField type="text" label={arg.name} value={arg.defaultValue} />
            )}
            {arg.type === 'number' && (
              <TextField type={arg.type} label={arg.description} defaultValue={arg.defaultValue} />
            )}
            <TextField type={arg.type} label={arg.id} defaultValue={arg.defaultValue} />
          </ListItem>
        ))}
      </List>
      {sensor.parameters.length > 0 && (
        <>
        <br />
        <Typography variant="h6">Parameters:</Typography>
        <List>
          {sensor.parameters.map((param, index) => (
            <ListItem key={'param-'+index}>
              {param.type === 'select' && (
                <TextField select label={param.name} defaultValue={param.defaultValue}>
                  {param.values.map((val, index) => (
                    <option key={index} value={val.defaultValue}>{val.name}</option>
                  ))}
                </TextField>
              )}
              {param.type === 'boolean' && (
                <TextField select label={param.name} defaultValue={param.defaultValue}>
                  <option key={0} value={true}>true</option>
                  <option key={1} value={false}>false</option>
                </TextField>
              )}
              {param.type === 'text' && (
                <TextField type="text" label={param.description} defaultValue={param.defaultValue} />
              )}
              {param.type === 'number' && (
                <TextField type="number" label={param.description} defaultValue={param.defaultValue} />
              )}
            </ListItem>
          ))}
        </List>
        </>
      )
      
      }
    </Box>
  );
}
export default SensorDownloadSettings;