import { Box, Button, Chip, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { fettchFitBitUser as fetchFitBitUser } from '../utils/firebase/users';
import ConfirmOptoutDialog from '../components/ConfrimOptoutDialog';

function UserProfile(props) {
  const { user, loading } = useContext(AuthContext);
  const [jamaspUser, setJamaspUser] = useState(null);
  const [fitbitProfile, setFitbitProfile] = React.useState({});
  // Alerts to display to the user
  // Use Context to set alerts
  // const { setAlerts } = useContext(AlertsContext);
  const [alerts, setAlerts] = React.useState([]);
  // User devices
  const [userDevices, setUserDevices] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    //console.log('UserProfile useEffect user', user, loading)
    if (user && !loading) {
      setIsLoading(true);
      fetchFitBitUser(user.uid).then((usr) => {
        let jUser = usr[0];
        //console.log('UserProfile fetchFitBitUser', jUser , jUser.fitbitData);
        setJamaspUser(jUser);
        try {
          axios.get('https://api.fitbit.com/1/user/-/profile.json', {
            headers: {
              Authorization: `Bearer ${jUser.fitbitData.access_token}`
            }
          }).then((result) => {
            if (result.status === 200 && result?.data?.user) {
              console.log(result.data.user);
              // update the user profile
              setFitbitProfile(result.data.user);
              axios.get('https://api.fitbit.com/1/user/-/devices.json', {
                headers: {
                  Authorization: `Bearer ${jUser.fitbitData.access_token}`
                }
              }).then((result) => {
                if (result.status === 200 && result?.data) {
                  console.log(result.data);
                  // update the user profile
                  setUserDevices(result.data);
                }
              }).catch((error) => {
                console.log(error);
              });
            }
          }).catch((error) => {
            console.log(error);
          }
          );
        } catch (err) {
          console.log(err);
        }
      }).catch((error) => {
        console.log(error);
        //setAlert({ type: 'error', message: error.message });
      });
      setIsLoading(false);
    }
  }, [user, loading]);

  const handleConfirmDialogOutput = (value) => {
    console.log("handleDialogClose", value);
    //setAlert(null);
    if (value) {
      // TODO: Opt out of research
    }
  };

  return (
    <Box sx={{ mt: 5, m: 1 }}>
      {loading && (
        // TODO: Create a loading component, use it here and in other places
        <Typography>Loading...</Typography>
      )}
      {!loading && (
        <>
          <Typography variant='h4'>User Profile</Typography>
          <Typography variant='body1' component='div'>
            Name: <Chip label={user.displayName}></Chip>
          </Typography>
          <Typography variant='body1' component='div'>
            Email: <Chip label={user.email}></Chip>
          </Typography>
          {isLoading && (
            <Typography variant='body1' component='div'>
              Loading...
            </Typography>
          )}
          {!isLoading && jamaspUser && jamaspUser.fitbitData && (
            <>
            <Typography variant='body1' component='div'>
              Joined on: <Chip label={jamaspUser?.createdAt?.toDate()?.toDateString()}></Chip>
            </Typography>
            <Typography variant='body1' component='div'>
              Fitbit Timezone: <Chip label={fitbitProfile?.timezone}></Chip>
            </Typography>
            <Typography variant='body1' component='div'>
              Devices: <Chip label={jamaspUser?.fitbitData?.access_token !== null ? "FitBit" : "None"}></Chip>
            </Typography>
              {userDevices.map((device) => {
                if (device.version === 'MobileTrack') {
                  return <></>;
                }
                return (
                  <Box key={device.deviceVersion}>
                    <Typography key={device.deviceVersion} variant="h5" component="h2" >
                      {device.deviceVersion}
                    </Typography>
                    <Typography key={device.type} variant="body1" component="p">
                      Type: {device.type}
                    </Typography>
                    <Typography key={device.battery} variant="body1" component="p">
                      Battery: {device.battery} | Battery Level: {device.batteryLevel}
                    </Typography>
                    <Typography key={device.lastSyncTime} variant="body1" component="p" fontWeight={'bold'}>
                      Last Sync Time: {device.lastSyncTime}
                    </Typography>
                  </Box>
                );
              })}
            <Box>
              <Button variant='contained' color='error' sx={{ float: 'right' }}>Opt out of research</Button>
            </Box>
            </>
          )}
        </>
      )}
    </Box>

  );

}
export default UserProfile;