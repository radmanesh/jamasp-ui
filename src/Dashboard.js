import { Button, Container, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthenticationBtn from './auth/AuthenticationBtn';
import { Navigate } from 'react-router-dom';
import { getFitbitAuthState } from './auth/FitbitAuth';
import { auth, logout } from './firebase';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  const [fitbitUser, setFitbitUser] = useState(null);

  // This is a demonstration for requesting data scopes
  // Could for fetching should be placed in a separate file.
  React.useEffect(() => {
 
    if (user){
      getFitbitAuthState(user.uid).then((fitbitUser) => {
        if(!fitbitUser){

        }
      });
    }else{
      console.log("user is null");
    }

  }, [user]); // The dependency array ensures the effect runs when the access token changes

  

  return (
    <Container maxWidth="sm">
      <Typography variant="h3">User Dashboard</Typography>
      <Button onClick={() => logout()}>Sign Out</Button>
      {fitbitUser === null && <div>You should authencate with fitbit</div>}
      {accessToken === null && <AuthenticationBtn />}
      {accessToken !== null && <div>Authenticated with {accessToken}</div>}
    </Container>
  );
};

export default Dashboard;
