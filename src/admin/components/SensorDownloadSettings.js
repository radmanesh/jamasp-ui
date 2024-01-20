import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Checkbox, FormControl, FormControlLabel, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { Fragment } from "react";

function SettingItem({ item, index, sensor, handleChange, itemSetting, settingType }) {
  if (item.name === 'user-id') return (<></>)
  return (
    <div>
      {item.type === 'text' && (
        <TextField type="text" name={item.name} label={item.name} value={itemSetting ? itemSetting : item.defaultValue} onChange={(e) => handleChange(e, sensor, settingType)} />
      )}
      {item.type === 'number' && (
        <TextField type="number" name={item.name} label={item.name} value={itemSetting ? itemSetting : item.defaultValue} onChange={(e) => handleChange(e, sensor, settingType)} />
      )}
      {item.type === 'date' && (
        <TextField type="date" name={item.name} label={item.name} value={itemSetting ? itemSetting : item.defaultValue} onChange={(e) => handleChange(e, sensor, settingType)} />
      )}
      {item.type === 'select' && (
        <TextField sx={{ minWidth: '150px' }} select name={item.name} label={item.name} value={itemSetting ? itemSetting : item.defaultValue} onChange={(e) => handleChange(e, sensor, settingType)}>
          {item.values.map((val, index) => (
            <MenuItem fullWidth key={index} value={val}>
              {val}
            </MenuItem>
          ))}
        </TextField>
      )}
      {item.type === 'boolean' && (
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox name={item.name} checked={itemSetting ? true : false} onChange={(e) => handleChange(e, sensor, settingType)} />
            }
            label={item.name}
          />
        </FormControl>
      )}
    </div>
  )
}

function SensorDownloadSettings({ sensor, sensorSettings, handleSettingsChange, handleRemoveSensor, project }) {
  if (!sensor) {
    return (
      <Box>
        <Typography variant="h4">No sensor selected</Typography>
      </Box>
    );
  } else {
    return (
      <Box>
        <Typography marginTop={4} variant="h4">
          {sensor.label}
          <Tooltip title="Delete">
            <IconButton aria-label="delete" color="error" onClick={() => handleRemoveSensor(sensor.id)} paddingLeft={2}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Typography>
        <Typography variant="caption">{sensor.description}</Typography>
        <Typography variant="body1" fontWeight={'bold'}> Arguments:</Typography>
        <Stack useFlexGap flexWrap="wrap" direction="row" spacing={2} alignItems={'center'}>
          {sensor.arguments.map((item, index) => (
            <SettingItem settingType='argument' item={item} index={index} sensor={sensor} itemSetting={sensorSettings?.arguments?.[item.name]} handleChange={handleSettingsChange} />
          ))}
        </Stack>
        {sensor.parameters.length > 0 && (
          <Fragment>
            <Typography variant="body1" fontWeight={'bold'}>Parameters:</Typography>
            <Stack useFlexGap flexWrap="wrap" direction="row" spacing={2} alignItems={'center'}>
              {sensor.parameters.map((item, index) => (
                <SettingItem settingType='parameter' item={item} index={index} sensor={sensor} itemSetting={sensorSettings?.parameters?.[item.name]} handleChange={handleSettingsChange} />
              ))}
            </Stack>
          </Fragment>
        )}
      </Box>
    );
  }

}
export default SensorDownloadSettings;