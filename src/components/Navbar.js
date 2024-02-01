import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../firebase';



const adminPages = [{ name: 'Admin', path: '/admin' }, { name: 'NewProject', path: '/admin/newProject' }, {name: 'Users', path: '/admin/users'}];
const pages = [{ name: 'Dashboard', path: '/home' }, { name: 'About', path: '/about' }];
const settings = [{ name: 'Dashboard', path: '/home' }, { name: 'Logout', path: '/auth/signout' }, { name: 'Profile', path: '/profile' }];

function Navbar({ user, loading }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    console.log("Open navMenu event", event)
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    console.log("Open userMenu event", event)
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event, path) => {
    //console.log("Close navMenu event", event)
    console.log(" path ", path)
    setAnchorElNav(null);
    navigate(path);
  };

  const handleCloseUserMenu = (event, path) => {
    console.log("Close userMenu event", event,path)
    setAnchorElUser(null);
    if(path === 'backdropClick' || path === 'escapeKeyDown'){
      return;
    }
    //console.log(" path ", path)
    if(path === '/auth/signout'){
      logout();
      navigate('/auth/signin', { replace: true });
    }
    if(path === '/profile'){
      navigate(path);
    }
    navigate(path);
  };

  React.useEffect(() => {
    console.log("user: ", user);
    console.log("loading: ", loading);
  }, [user,loading]);  

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Jamasp
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, maxWidth: '48px' }} component="img" src="/images/logo/android-chrome-192x192.png" />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(e) => handleOpenNavMenu(e)}
              color="inherit"
            >
              <MenuIcon />

            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={(e) => handleCloseNavMenu(e)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {/* TODO: Check its admin or regular user */}
              {[...pages, ...adminPages].map((page) => (
                <MenuItem key={page.path} onClick={(e) => handleCloseNavMenu(e, page.path)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              )
              )}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '192px' }} component="img" src="/images/logo/android-chrome-192x192.png" />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* TODO: Check its admin or regular user */}

            {[...pages, ...adminPages].map((page) => (
              <Button
                key={page.path}
                onClick={(e) => handleCloseNavMenu(e, page.path)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.displayName} src={user?.photoURL} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.path} onClick={(e) => handleCloseUserMenu(e, setting.path)}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  );
}
export default Navbar;