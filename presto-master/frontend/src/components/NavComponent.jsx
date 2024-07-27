import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LogoutButton from './LogoutButton';
import NewPresentationBtn from './NewPresentationBtn';

const NavComponent = ({ token, setToken, store, setStore }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <NewPresentationBtn
              token={token}
              store={store}
              setStore={setStore}
            ></NewPresentationBtn>
          </Typography>
          <LogoutButton token={token} setToken={setToken} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavComponent;
