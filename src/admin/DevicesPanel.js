import { Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

function DevicesPanel(props) {
  const { project } = props;
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

  return (
    <React.Fragment>
      <FormGroup>
        {users.map((user, index) => (
          <FormControlLabel key={index} control={<Checkbox defaultChecked />} label={`${user.name} | ${user?.fitbitData?.user_id}`} />
        ))}
      </FormGroup>

      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ pt: 2}}>
        <Button variant="contained" color="primary">Save</Button>
        <Button variant="contained" color="warning">Delete</Button>
        <Button variant="contained" color="secondary">Next</Button>
      </Stack>

    </React.Fragment>

  )
}

export default DevicesPanel;
