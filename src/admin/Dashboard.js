import { Button, Container, Grid, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h3">Admin Dashboard</Typography>
      <Typography variant="body1">Welcome stefan! This is your dashboard where you can see your projects. </Typography>
      <nav aria-label="secondary mailbox folders">
        <List>
          {projects.map((project) => (
            <ListItem disablePadding key={project.id}>
              <ListItemButton component="a" href={`/showProject/${project.id}`}>
                <ListItemText primary={project.name} />
              </ListItemButton>
            </ListItem>
          ))}
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
