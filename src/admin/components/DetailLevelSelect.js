import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as React from 'react';

export default function DetailLevelSelect(props) {
  const { onUserInput, detailLevel } = props;

  const itemsList = [
    {
      id: 1,
      name: '1 Minute',
      value: '1min'
    },
    {
      id: 2,
      name: '5 Minutes',
      value: '5min'
    },
    {
      id: 3,
      name: '15 Minutes',
      value: '15min'
    },
    {
      id: 4,
      name: '1 Second',
      value: '1s'
    },
  ]

  const handleChange = (event) => {
    onUserInput('detailLevel', event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="detail-level-select-label">Detail Level</InputLabel>
      <Select
        labelId="detail-level-select-label"
        id="detail-level-select"
        value={detailLevel}
        defaultValue={itemsList[0].value}
        label="Level"
        onChange={handleChange}
      >
        {itemsList.map((item) => (
          <MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}