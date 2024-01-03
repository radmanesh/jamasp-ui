import React, { useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Divider, List, SwipeableDrawer, Toolbar, Typography } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';

const Navbar = () => {
    //const user = useSelector((state) => state.user.value);
    //const [user, loading] = useAuthState(auth);

    return (
        <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Jamasp</Typography>
        </Toolbar>
      </AppBar>
    )
}

export default Navbar;