import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

function DevicesPanel(props) {
  const { project , onUserInput , userDevices } = props;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("fitbitData", "!=", null));
      const querySnapshot = await getDocs(q);
      setUsers(querySnapshot.docs.map(doc => doc.data()));
    };

    fetchUsers();
  }, []);

  const handleCheckboxChange = (user, isChecked) => {
    onUserInput(user, isChecked);
  };

  return (
    <React.Fragment>
      <FormGroup>
        {users.map((user, index) => (
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
