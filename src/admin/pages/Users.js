import { Box, Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { fetchFitBitUsers } from '../../utils/firebase/users';
import { Link, useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = React.useState([]);

  const navigate = useNavigate();

  // Fetch users on mount
  useEffect(() => {
    fetchFitBitUsers().then((users) => {
      console.log("users", users);
      setUsers(users);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  // Refresh users data
  useEffect(() => {
    console.log("users", users);

  }, [users]);


  async function refreshUsersData(userId) {
    console.log("refreshUsersData", userId);
    //
  }

  return (
    <Box>
      <Typography variant="h1" component="h1" gutterBottom>Users</Typography>
      <List>
        {users.map((user) => (
          <ListItem
              key={user.id}
              disablePadding
              secondaryAction={<Button edge="end" variant="contained" color="success" onClick={() =>  refreshUsersData(user.uid)}>Refresh</Button>}
            >
              <ListItemButton component={Link} to={`/admin/users/${user.uid}`} >
                <ListItemText primary={user.name} />
              </ListItemButton>
            </ListItem>

        ))}
      </List>
    </Box>
  );
};
export default Users;