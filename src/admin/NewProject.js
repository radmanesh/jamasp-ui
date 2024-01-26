import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React from 'react';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Timestamp, collection } from 'firebase/firestore';
import { addDoc } from 'firebase/firestore';
import { getAllSensorsId } from './utils/utils';
import { getAllFitbitUsersId } from '../utils/firebase/users';

// Create a new project

const NewProject = () => {

  const navigate = useNavigate();

  /**
   * Handles the form submission for creating a new project.
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const projectName = data.get("name");

    getAllFitbitUsersId().then((fitbitUserIds) => {
      // Add the project to Firestore
      const projectDoc = {
        name: projectName,
        devices: fitbitUserIds,
        sensors: getAllSensorsId(),
        settings: {
          detailLevel: '1min',
          dateRange: {
            from: Timestamp.fromMillis(new Date(2023, 12, 1).getTime()),
            to: Timestamp.fromMillis(new Date(2024, 1, 1).getTime()),
          },
          enabled: true,
        },
        downloadSettings: [
        ],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      //console.log(projectDoc);

      addDoc(collection(db, "projects"), projectDoc).then((docRef) => {
        const projectId = docRef.id;
        console.log("Project added to Firestore with ID:", projectId, projectDoc);
        // Redirect to the project page
        navigate(`/admin/showProject/${projectId}`);
      });
    });
  };

  // Render the form
  return (
    <Container maxWidth="lg">

      <Typography variant="h3">Create Project</Typography>
      <Typography variant="body1">Create a new project and add devices to it.</Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="projectName"
          label="Project Name"
          name="name"
          autoComplete="Project Name"
          autoFocus
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create Project
        </Button>
      </Box>
    </Container>

  );
};

export default NewProject;
