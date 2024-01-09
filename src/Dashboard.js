import { Button, Container, Typography } from '@mui/material';
import { setUserId } from 'firebase/analytics';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthenticationBtn from './auth/AuthenticationBtn';
import { getFitbitAuthState } from './auth/FitbitAuth';
import { auth, logout } from './firebase';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  const [fitbitToken, setFitbitToken] = useState(null);

  // This is a demonstration for requesting data scopes
  // Could for fetching should be placed in a separate file.
  React.useEffect(() => {
    if(loading){  // if auth state is loading
      // maybe trigger a loading screen
      return;
    }
 
    if (user){
      getFitbitAuthState(user.uid).then((fitbitToken) => {
        if(!fitbitToken){
          //something is wrong with the getting token
          // we should redirect to the fitbit login page
          console.log("WOWO!!!! fitbitToken is null");
          //alert("WOWO!!!! fitbitToken is null");
          return;
        }else{
          console.log(fitbitToken);
          if(!fitbitToken.access_token){
            // we should redirect to the fitbit login page
            console.log("fitbitToken.accessToken is null");
            alert("fitbitToken no null but fitbitToken.accessToken is null!!!!!!")
            return;
          }else{
            // we have the access token, we should store it in the local storage. we should also store the refresh token and user id
            // also we should store the expiration time and check if the token is expired or not.
            setFitbitToken(fitbitToken.access_token);
            setUserId(fitbitToken.user_id);
            localStorage.setItem('accessToken', fitbitToken.access_token);
            localStorage.setItem('refreshToken', fitbitToken.refresh_token);
            localStorage.setItem('userId', fitbitToken.user_id);
          }
          
        }
      });
    }else{
      console.log("user is null");
    }

  }, [loading, user]); // The dependency array ensures the effect runs when the access token changes

  

  return (
    <Container maxWidth="sm">
      <Typography variant="h3">User Dashboard</Typography>
      <Button onClick={() => logout()}>Sign Out</Button>
      {fitbitToken === null && <div>You should authencate with fitbit</div>}
      {accessToken === null && <AuthenticationBtn />}
      {accessToken !== null && <div>Hello {userId} , you are authenticated with {accessToken}</div>}
    </Container>
  );
};

export default Dashboard;
