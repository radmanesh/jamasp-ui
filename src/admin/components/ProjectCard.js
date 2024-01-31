import { Button, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useEffect } from 'react';
export default function ProjectCard({ project, handleDeleteProject, handlePorjcetAction }) {

  useEffect(() => {
    console.log('ProjectCard mounted');
    return () => {
      console.log('ProjectCard unmounted');
    };
  }, []);

  return (
    <ListItem
    key={project.id}
    disablePadding
    secondaryAction={<Button edge="end" variant="contained" color="error" onClick={() => handleDeleteProject(project.id)}>Delete</Button>}
  >
    <ListItemButton component="button" to={`/admin/showProject/${project.id}`}>
      <ListItemText primary={project.name} />
    </ListItemButton>
  </ListItem>

  );
} 