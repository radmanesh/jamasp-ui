import { ThumbUp as ThumbUpIcon } from '@mui/icons-material';
import { Container, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthenticationBtn from './auth/AuthenticationBtn';
import { getFitbitAuthState, removeDevice } from './auth/FitbitAuth';
import { auth } from './firebase';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [fitbitToken, setFitbitToken] = useState(null);


  // This is a demonstration for requesting data scopes
  // Code for fetching should be placed in a separate file.
  React.useEffect(() => {
    if (loading) {  // if auth state is loading
      // maybe trigger a loading screen
      return;
    }

    if (user) {
      getFitbitAuthState(user.uid).then((fitbit_token) => {
        if (!fitbit_token) {
          //something is wrong with the getting token
          // we should redirect to the fitbit login page
          console.log("WOWO!!!! fitbitToken is null");
          //alert("WOWO!!!! fitbitToken is null");
          return;
        } else {
          console.log(fitbit_token);
          if (fitbit_token.access_token === null) {
            // we should redirect to the fitbit login page
            console.log("fitbitToken.accessToken is null");
            //alert("fitbitToken no null but fitbitToken.accessToken is null!!!!!!")
            return;
          } else {
            // we have the access token, we should store it in the local storage. we should also store the refresh token and user id
            // also we should store the expiration time and check if the token is expired or not.
            setFitbitToken(fitbit_token);
          }

        }
      });
    } else {
      console.log("user is null");
    }

  }, [loading, user]); // The dependency array ensures the effect runs when the access token changes

  function removeUserDevice() {
    if (user) {
      removeDevice(user.uid).then((newUser) => {
        console.log("newUser", newUser);
        setFitbitToken(null);
      });
    } else {
      console.log("user is null");
    }
  }


  return (
    <Container maxWidth="md" sx={{ mt: 1 }} align="center">
      <Typography variant="h3">User Dashboard</Typography>
      {/* <Button onClick={() => logout()}>Sign Out</Button> */}
      {fitbitToken === null && <div>You should authenticate with fitbit</div>}
      {fitbitToken === null && <AuthenticationBtn />}
      {fitbitToken !== null &&
        <div>
          <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden', opacity: 0.9, m: 3, p: 3 }} >
            <Typography variant="h6" color="initial" >
              You are authenticated with user id of : {fitbitToken?.user_id}
            </Typography>
            <Typography variant="body1" color="initial">
              Thank you for joining our experiment and completing the this step.
            </Typography>
            <Typography variant="h4" color="initial">
              You are good to go.
            </Typography>
            <ThumbUpIcon color='success' sx={{ fontSize: '100px', bottom: 0, alignSelf: 'center' }} />
            {/* <Button align="end"  size= 'small' variant='contained' color='error' onClick={() => removeUserDevice()}>Remove Device</Button> */}
          </Paper>

        </div>
      }
    </Container>
  );
};

export default Dashboard;
// Remove the export statement for removeUserDevice
