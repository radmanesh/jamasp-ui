import { Button, Container, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthenticationBtn from './auth/AuthenticationBtn';
import { getFitbitAuthState } from './auth/FitbitAuth';
import { auth, logout } from './firebase';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [fitbitToken, setFitbitToken] = useState(null);

  // This is a demonstration for requesting data scopes
  // Could for fetching should be placed in a separate file.
  React.useEffect(() => {
    if(loading){  // if auth state is loading
      // maybe trigger a loading screen
      return;
    }
 
    if (user){
      getFitbitAuthState(user.uid).then((fitbit_token) => {
        if(!fitbit_token){
          //something is wrong with the getting token
          // we should redirect to the fitbit login page
          console.log("WOWO!!!! fitbitToken is null");
          //alert("WOWO!!!! fitbitToken is null");
          return;
        }else{
          console.log(fitbit_token);
          if(fitbit_token.access_token===null){
            // we should redirect to the fitbit login page
            console.log("fitbitToken.accessToken is null");
            //alert("fitbitToken no null but fitbitToken.accessToken is null!!!!!!")
            return;
          }else{
            // we have the access token, we should store it in the local storage. we should also store the refresh token and user id
            // also we should store the expiration time and check if the token is expired or not.
            setFitbitToken(fitbit_token);
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
      {fitbitToken === null && <AuthenticationBtn />}
      {fitbitToken !== null && <div>Hello {fitbitToken?.user_id} , you are authenticated with {fitbitToken?.access_token}</div>}
    </Container>
  );
};

export default Dashboard;
