import { Button, Container, Grid, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React from 'react';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3">Admin Dashboard</Typography>
      <Typography variant="body1">Welcome stefan! This is your dashboard where you can see your projects. </Typography>
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/showProject" >
              <ListItemText primary="Project 1" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/showProject">
              <ListItemText primary="Project 2" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>

      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Grid item>
          <Button variant="contained" href="/newProject">New Project</Button>
        </Grid>
      </Grid>

    </Container>

  );
};

export default AdminDashboard;
