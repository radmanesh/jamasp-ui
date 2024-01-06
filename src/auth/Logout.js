import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function Logout() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/auth/login");
  }, [user, loading, navigate]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      logout();
      //return <Navigate to="/auth/login" replace />
    } else {
      // User is signed out
      //return <Navigate to="/auth/login" replace />
    }
  });
  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="p">
        Logging out
      </Typography>
    </Box>
  );
}
export default Logout;