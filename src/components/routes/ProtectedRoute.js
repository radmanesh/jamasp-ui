import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './Navbar';
import { Container, Link, Typography } from '@mui/material';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }
  return children ? children : (

    <React.Fragment>
      <Navbar />

      <Container maxWidth="lg">
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
      <Link color="inherit" href="https://jamasp.cut.social/">
        Jamasp®
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default ProtectedRoute