import React from 'react';
import { AppBar, Toolbar, Typography, Container, Link, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
const AuthLayout = () => {
  return (
    <React.Fragment>
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Jamasp</Typography>
        </Toolbar>
      </AppBar> */}

      <Container component="main" maxWidth="xs">
        <Outlet />
      </Container>

      <footer>
        <Copyright />
      </footer>
    </React.Fragment>

  );
};

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://jamasp.cut.social/">
        Jamasp
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default AuthLayout;
