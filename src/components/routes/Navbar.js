import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';

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