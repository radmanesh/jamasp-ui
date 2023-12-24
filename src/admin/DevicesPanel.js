import { Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import React from 'react';

function DevicesPanel(props) {
  return (
    <React.Fragment>
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Arman | URW32" />
        <FormControlLabel control={<Checkbox />} label="Mostafa | DRW93" />
      </FormGroup>

      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ pt: 2}}>
        <Button variant="contained" color="primary">Save</Button>
        <Button variant="contained" color="secondary">Next</Button>
      </Stack>

    </React.Fragment>

  )
}

export default DevicesPanel;
