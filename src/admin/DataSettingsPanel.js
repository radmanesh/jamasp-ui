import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import DetailLevelSelect from './components/DetailLevelSelect';

function DataSettingsPanel(props) {
  const { project, onUserInput, userSettings, onDateChange } = props;
  //console.log('from', userSettings.dateRange.from, userSettings.dateRange.from instanceof Timestamp,userSettings.dateRange.from.toDate(), userSettings.dateRange.from.toDate() instanceof Date);
  let fromDayjs = dayjs(userSettings.dateRange.from.toDate());
  let toDayjs = dayjs(userSettings.dateRange.to.toDate());

  // @TODO: Handle time also not just date
  // todo: handle timezones and project

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
          <FormControlLabel
            control={
              <DetailLevelSelect detailLevel={userSettings.detailLevel} onUserInput={onUserInput} />
            }
            label=""
          />
        </FormControl>
      </FormGroup>


      <Stack direction="row" spacing={2} justifyContent="space-evenly" sx={{ p: 1 }}>
        <DateTimePicker label="From" defaultValue={new Date(2023, 12, 1)} value={fromDayjs} onChange={(val) => onDateChange('from', Timestamp.fromDate(val.toDate()))} />
        <DateTimePicker label="To" defaultValue={new Date(2024, 1, 1)} value={toDayjs} onChange={(val) => onDateChange('to', Timestamp.fromDate(val.toDate()))} />
      </Stack>

      <FormGroup>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox checked={userSettings.enabled} onChange={(e) => onUserInput('enabled', e.target.checked)} name="enabled" />
            }
            label="Enabled?"
          />
        </FormControl>
      </FormGroup>

    </Box>
  )
}

export default DataSettingsPanel;
