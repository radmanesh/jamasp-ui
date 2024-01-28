import { Alert, Button, Container, Grid, LinearProgress, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  // Get all projects from the database
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  }, []);


  const handleDeleteProject = (projectId) => {
    var projectName = undefined;
    setIsLoading(true);
    try {
      projectName = projects.filter((project) => project.id === projectId).at(0).name;
      console.log(`Deleting project ${projectName} with id: ${projectId}`);
      deleteDoc(doc(db, "projects", projectId)).then(() => {
        //console.log(`Project with id: ${projectId} deleted successfully`);
        setProjects(projects.filter((project) => project.id !== projectId));
        setAlert({ type: 'success', message: `Project ${projectName} with id: ${projectId} deleted successfully` });
        setTimeout(() => setAlert(null), 5000); // Hide the alert after 5 seconds
      }).catch((error) => {
        setAlert({ type: 'error', message: `Project with id: ${projectId} could not be deleted!` });
        setTimeout(() => setAlert(null), 5000); // Hide the alert after 5 seconds
        console.error("Error deleting project: ", error);
      });
    } catch (error) {
      setAlert({ type: 'error', message: `Project with id: ${projectId} could not be deleted!` });
      setTimeout(() => setAlert(null), 5000); // Hide the alert after 5 seconds
      console.error("Error deleting project: ", error);
    }
    setIsLoading(false);
  }

  return (
    <Container sx={{ mt: 1 }}>
      <Typography variant="h3">Admin Dashboard</Typography>
      <Typography variant="body1">Welcome {auth?.currentUser?.displayName}! This is your dashboard where you can see your projects. </Typography>
      {isLoading && <LinearProgress />}
      {alert && <Alert severity={alert.type}>{alert.message}</Alert>}
      {/* FIXME: What is this tag doing? if it's really doing something use the correct labels */}
      <nav aria-label="secondary mailbox folders">
        <List>
          {projects.map((project) => {
            return (
              <ListItem
                key={project.id}
                disablePadding
                secondaryAction={<Button edge="end" variant="contained" color="error" onClick={() => handleDeleteProject(project.id)}>Delete</Button>}
              >
                <ListItemButton component="a" href={`/admin/showProject/${project.id}`}>
                  <ListItemText primary={project.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </nav>

      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Grid item>
          {/* <Button variant="contained" href="/admin/newProject">New Project</Button> */}
          <Button variant="contained" onClick={(e) => navigate("/admin/newProject")} href="/admin/newProject">New Project</Button>
        </Grid>
      </Grid>

    </Container>

  );
};

export default AdminDashboard;
