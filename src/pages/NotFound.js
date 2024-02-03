import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const NotFound = () => {
  return (
    <Box sx={{ mt: 5, m: 1 }}>
      <Typography variant="h1">Not Found</Typography>
      <Typography variant='body1' >The page you are looking for does not exist...</Typography>
    </Box>
  );
};  

export default NotFound;