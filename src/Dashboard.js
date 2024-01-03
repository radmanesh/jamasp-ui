import React from 'react';
import { Container, Typography } from '@mui/material';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <Container maxWidth="sm">
      <Typography variant="h3">User Dashboard</Typography>
      <Typography variant="body1">Hello {user.displayName}, You have completed the setup, good to go!</Typography>
    </Container>
  );
};

export default Dashboard;
