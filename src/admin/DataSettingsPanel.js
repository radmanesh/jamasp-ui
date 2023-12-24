import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, Stack } from '@mui/material';
import React from 'react';
import DetailLevelSelect from './components/DetailLevelSelect';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Form } from 'react-router-dom';

function DataSettingsPanel(props) {
  return (
    <Box
      component="form"
      sx={{
        p: 3,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <FormGroup>
        <FormControl>
          <FormControlLabel control={<DetailLevelSelect />} label="" />
        </FormControl>
      </FormGroup>

      
      <Stack direction="row" spacing={2} justifyContent="space-evenly" sx={{ p: 1}}>
        <DateTimePicker label="From" defaultValue={dayjs('2023-04-17T00:00')} />    
        <DateTimePicker label="To" defaultValue={dayjs('2023-12-17T00:00')} />
      </Stack>
      
      <FormGroup>
        <FormControl>
          <FormControlLabel control={<Checkbox />} label="Enabled?" />
        </FormControl>
      </FormGroup>

      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{pt:2}}>
        <Button variant="contained" color="primary">Save</Button>
        <Button variant="contained" color="secondary">Download</Button>
      </Stack>

    </Box>
  )
}

export default DataSettingsPanel;
