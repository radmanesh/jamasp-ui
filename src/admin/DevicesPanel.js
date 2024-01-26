import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { fetchFitBitUsers } from '../utils/firebase/users';

function DevicesPanel(props) {
  const { project , onUserInput , userDevices } = props;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchFitBitUsers().then((users) => {
      setUsers(users);
    }).catch((error) => {
      console.log(error);
    });
  }, []);


  // handle checkbox change
  const handleCheckboxChange = (user, isChecked) => {
    onUserInput(user, isChecked);
  };

  return (
    <React.Fragment>
      <FormGroup>
        {users?.map((user, index) => (
          <FormControlLabel 
          key={index} 
          control={
            <Checkbox 
              checked={userDevices.includes(user?.fitbitData?.user_id)}
              onChange={(e) => handleCheckboxChange(user?.fitbitData?.user_id, e.target.checked)} 
            />
          } 
          label={`${user.name} | ${user?.fitbitData?.user_id}`} 
        />
      ))}
      </FormGroup>

    </React.Fragment>

  )
}

export default DevicesPanel;
