import { Alert, Container, LinearProgress, List, Typography } from '@mui/material';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import ProjectCard from './components/ProjectCard';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  // Get all projects from the database
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    setIsLoading(false);
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


  const handleProjectAction = ({ project, action, data }) => {


  }

  return (
    <Container sx={{ mt: 1 }}>
      <Typography variant="h3">Admin Dashboard</Typography>
      <Typography variant="body1">Welcome {auth?.currentUser?.displayName}! This is your dashboard where you can see your projects. </Typography>
      {isLoading && <LinearProgress />}
      {alert && <Alert severity={alert.type}>{alert.message}</Alert>}
      {!isLoading && projects.length === 0 && <Typography variant="body1">You have no projects.</Typography>}
      {/* <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} lg={6} key={project.id}>
              <ProjectCard key={project.id} project={project} handleDeleteProject={handleDeleteProject} handlePorjectAction={handleProjectAction} />
            </Grid>
          ))}
        </Grid> */}
      {!isLoading && projects.length > 0 && (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {projects.map((project) => {
            return (
              <ProjectCard key={project.id} project={project} handleDeleteProject={handleDeleteProject} handlePorjectAction={handleProjectAction} />
            );
          })}
        </List>

      )}
    </Container>

  )
};

export default AdminDashboard;
