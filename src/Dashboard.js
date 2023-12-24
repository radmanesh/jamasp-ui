import React from 'react';
import { Container, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h1">Dashboard</Typography>
      <Typography variant="body1">Hello user, You have completed the setup, good to go!</Typography>
    </Container>
  );
};

export default Dashboard;
