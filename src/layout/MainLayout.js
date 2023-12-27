import React from 'react';
import { AppBar, Toolbar, Typography, Container, Link } from '@mui/material';
import { Outlet } from 'react-router-dom';
const MainLayout = () => {
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Jamasp</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Outlet />
      </Container>

      <footer>
        <Copyright />
      </footer>
    </React.Fragment>
  );
};

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://jamasp.cut.social/">
        Jamasp®
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default MainLayout;
