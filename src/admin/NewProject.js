import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React from 'react';

const NewProject = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      projectName: data.get('name')
    });
  };

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
