import { Alert, Box, Button, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import { isArray } from 'lodash';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import { refreshFitbitToken } from '../../auth/FitbitAuth';
import { fetchUserProfile, fetchUserProfileNow } from '../../auth/api/profile';
import { fettchFitBitUser } from '../../utils/firebase/users';

function ShowUser(props) {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  // theUser is the user object from datastore and gotten from the db by params
  const [theUser, setTheUser] = React.useState(null);
  const [userProfile, setUserProfile] = React.useState({});
  // Alerts to display to the user
  const [alert, setAlert] = React.useState(null);
  // User devices
  const [userDevices, setUserDevices] = React.useState([]);
  // User object from the AuthContext set in App.js
  const { user, loading } = React.useContext(AuthContext);


  /**
   * Retrieves project data from Firestore and updates the state on startup.
   * 
   * @return {void}
   */
  useEffect(() => {
    setIsLoading(true);
    fettchFitBitUser(userId).then((user) => {
      console.log('showUser: userFound:', user);
      if (isArray(user)) {
        user = user[0];
      }
      setTheUser(user);
      try {
        axios.get('https://api.fitbit.com/1/user/-/profile.json', {
          headers: {
            Authorization: `Bearer ${user.fitbitData.access_token}`
          }
        }).then((result) => {
          if (result.status === 200 && result?.data?.user) {
            console.log(result.data.user);
            // update the user profile
            setUserProfile(result.data.user);
            axios.get('https://api.fitbit.com/1/user/-/devices.json', {
              headers: {
                Authorization: `Bearer ${user.fitbitData.access_token}`
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
      setAlert({ type: 'error', message: error.message });
    });
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    console.log("theUser: ", theUser);
    // return if theUser is null
    // if (theUser === null || theUser === undefined)
    //   return;
    // const prof = fetchUserProfileNow(theUser).then((result) => {
    //   console.log("result profNOW: ", result);
    // }).catch((error) => {
    //   console.log(error);
    // }
    // );
    // console.log("prof: ", prof);
    // fetchUserProfile(theUser).then((result) => {
    //   console.log("result: ", result);
    //   if (result.status)
    //     setUserProfile(result.data);
    // }).catch((error) => {
    //   console.log(error);
    // });
  }, [theUser]);


  function refreshFitbitTokenHandle() {
    console.log("refreshFitbitToken: ", theUser);
    setIsLoading(true);
    refreshFitbitToken(theUser.uid).then((result) => {
      console.log("refreshFitbitToken: ", result);
      setUserProfile(result?.data?.user);
    }).catch((error) => {
      console.log(error);
    }
    );
    setAlert({ type: 'success', message: 'Refreshing Fitbit Token' });
    setIsLoading(false);
  }

  return (
    <Box>
      {isLoading && <LinearProgress />}
      <Typography variant="h4" component="h1" gutterBottom>Showing user {theUser?.name}</Typography>
      {alert && <Alert severity={alert.type}>{alert.message}</Alert>}
      <Box>
        <Button variant="contained" color="primary" onClick={refreshFitbitTokenHandle}>Refresh Fitbit Token</Button>
      </Box>
      {!isLoading && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>User: {theUser?.name}</Typography>
          <Typography variant="h5" component="h2" gutterBottom>Email: {theUser?.email}</Typography>
          <Typography variant="h5" component="h2" gutterBottom>Fitbit ID: {theUser?.fitbitData?.user_id}</Typography>
          <Typography variant="h5" component="h2" gutterBottom>Last Token Updated At: {(theUser?.fitbitData?.timestamp !== null && theUser?.fitbitData?.timestamp !== undefined && theUser?.fitbitData?.timestamp?.toDate() && theUser?.fitbitData?.timestamp?.toDate() !== null && theUser?.fitbitData?.timestamp?.toDate() !== undefined) ? theUser?.fitbitData?.timestamp?.toDate()?.toLocaleString() : 'Undefined'}</Typography>
          {
            Object.entries(userProfile).map(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                if (key === 'topBadges') {
                  return (
                    <div key={key}>
                      <Typography key={key} variant="body1" component="p" gutterBottom>
                        TOP {key}:
                      </Typography>
                      {value.map((badge) => {
                        console.log("inloop deplsy",badge);
                        return (
                          <Typography key={badge.badgeGradientEndColor} variant="body1" component="p">
                            <img src={badge.image50px} alt={badge.name} /> {badge.shortName} : {badge.name} : {badge?.category} : {badge.badgeType} : {badge.description} : {badge.earnedMessage} 
                          </Typography>
                        )
                      })}
                    </div>
                  )
                } else {
                  return (
                    <div key={key}>
                      <Typography variant="body1" component="p" gutterBottom>
                        {key}:
                      </Typography>
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <Typography key={subKey} variant="body1" component="p" gutterBottom>
                          {subKey}: {subValue}
                        </Typography>
                      ))}
                    </div>
                  );
                }
              } else {
                return (
                  <Typography key={key} variant="body1" component="p" gutterBottom>
                    {key}: {value}
                  </Typography>
                );
              }
            })
          }
        </Box>
      )}
      <Typography variant="h5" component="h2" gutterBottom>Devices:</Typography>
      {userDevices.map((device) => {
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
    </Box>
  );
};
export default ShowUser;