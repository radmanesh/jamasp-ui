import { Box, Typography } from '@mui/material';
import * as React from 'react';

export default function About(){
  return (
    <Box> 
      <Typography variant="h1" component="h1" gutterBottom>About</Typography>
      <Typography variant="body1" gutterBottom>
        This is the about page.
      </Typography>
    </Box>
  );
}