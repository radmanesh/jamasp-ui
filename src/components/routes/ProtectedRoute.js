import { Container, LinearProgress, Link, Typography } from '@mui/material';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ProtectedRoute = ({ user, loading, children }) => {

  if (!loading && !user) {
    console.log("ProtectedRoute is redirecting to login",user,loading);
    // if the user is not logged in, redirect to the login page , it goes back in history
    return <Navigate to="/auth/login" replace />
  }

  return children ? children : (

    <React.Fragment>
      <Navbar user={user} loading={loading} />
      <Container maxWidth="lg">
        {loading && (
          <LinearProgress />
        )}
          <Outlet />
      </Container>

      <footer>
        <Copyright />
      </footer>
    </React.Fragment>
  );
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://jamasp.web.app/">
        Jamasp®
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default ProtectedRoute