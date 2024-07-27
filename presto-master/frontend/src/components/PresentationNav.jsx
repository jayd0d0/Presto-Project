import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuPopupState from './MenuPopBar';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Present from './Present';

function ResponsiveAppBar ({ token, store, setStore }) {
  const { presentationId, slideNo } = useParams();
  const title = store.presentations.find(
    (presentation) => presentation.presentationId === parseInt(presentationId)
  )?.title;
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <MenuPopupState token={token} store={store} setStore={setStore} />
        </Box>
        <Box>
          <Title>{title}</Title>
        </Box>
        <Box>
          <Present presentationId={presentationId} slideNo={slideNo} />
        </Box>
        <Box></Box>
      </Toolbar>
    </AppBar>
  );
}

const Title = styled('h1')({
  fontSize: '24px'
});

export default ResponsiveAppBar;
