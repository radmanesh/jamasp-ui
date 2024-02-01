import { Box, Container, LinearProgress, Link, Typography } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const ProtectedRoute = ({ user, loading, children }) => {

  if (!loading && !user) {
    console.log("ProtectedRoute is redirecting to login", user, loading);
    // if the user is not logged in, redirect to the login page , it goes back in history
    return <Navigate to="/auth/login" replace />
  }

  return children ? children : (
    <Container>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Navbar user={user} loading={loading} />
        <Container sx={{ flexGrow: 1 }}>
          {loading && (
            <LinearProgress />
          )}
          <Outlet />
        </Container>

        <Footer />
      </Box>
    </Container>
  );
}

function Footer(props) {
  return (
    <Box
      sx={{
        borderTop: "1px solid #0000000a",
        marginTop: "auto",
        p: 4,
      }}
      component="footer"
    >
      <Copyright />
    </Box>
  )
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