import { Navigate, useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import PresentationNav from '../components/PresentationNav';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AddSlideButton from '../components/AddSlideButton';
import DeleteSlideButton from '../components/DeleteSlideButton';
import AddTextBox from '../components/AddTextBox';
import AddImage from '../components/AddImage';
import AddVideo from '../components/AddVideo';
import AddCode from '../components/AddCode';
import TextBoxes from '../components/TextBoxes';
import Images from '../components/Images';
import Videos from '../components/Videos';
import Codes from '../components/Codes';
import CssBaseline from '@mui/material/CssBaseline';
import ChangeBackground from '../components/ChangeBackground';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function PresentationEditor ({ token }) {
  if (token === null) {
    return <Navigate to="/login" />;
  }
  const { presentationId, slideNo } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [store, setStore] = React.useState({});
  const [presentationIndex, setPresentationIndex] = React.useState(-1);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    parseInt(slideNo) - 1
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/store', {
          headers: {
            Authorization: token
          }
        });
        setStore(response.data.store);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();
  }, [token]);

  React.useEffect(() => {
    // Update current slide index when slide number changes in URL
    setCurrentSlideIndex(parseInt(slideNo) - 1);
  }, [slideNo]);

  React.useEffect(() => {
    if (store.presentations) {
      const existencePIndex = store.presentations.findIndex(
        (presentation) =>
          presentation.presentationId === parseInt(presentationId)
      );
      setPresentationIndex(existencePIndex);
    }
  }, [store.presentations]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (presentationIndex !== -1) {
    const presentation = store.presentations[presentationIndex];
    if (
      !(
        parseInt(slideNo) >= 1 &&
        parseInt(slideNo) <= presentation.slides.length
      )
    ) {
      return <Navigate to="/dashboard" />;
    }
  } else {
    return <Navigate to="/dashboard" />;
  }

  const currentSlide =
    store.presentations[presentationIndex].slides[currentSlideIndex];
  const totalSlides = store.presentations[presentationIndex].slides.length;

  const handleNextSlide = () => {
    const hasNextSlide =
      currentSlideIndex <
      store.presentations[presentationIndex].slides.length - 1;
    if (hasNextSlide) {
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
      navigate(`/edit/${presentationId}/${parseInt(slideNo) + 1}`);
    }
  };

  const handlePreviousSlide = () => {
    const hasPreviousSlide = currentSlideIndex > 0;
    if (hasPreviousSlide) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
      navigate(`/edit/${presentationId}/${parseInt(slideNo) - 1}`);
    }
  };

  const drawerWidth = 125;

  const arrowNavigate = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePreviousSlide();
    } else if (e.key === 'ArrowRight') {
      handleNextSlide();
    }
  };

  return (
    <Box
      sx={{ display: 'flex', height: '100vh' }}
      tabIndex={0}
      onKeyDown={arrowNavigate}
    >
      <CssBaseline />
      <PresentationNav token={token} store={store} setStore={setStore} />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '68px'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ChangeBackground
              token={token}
              store={store}
              setStore={setStore}
              currentIndex={currentSlideIndex}
            />
            <AddSlideButton token={token} store={store} setStore={setStore} />
            <AddTextBox
              token={token}
              store={store}
              setStore={setStore}
              currentIndex={currentSlideIndex}
            />
            <AddImage
              token={token}
              store={store}
              setStore={setStore}
              currentIndex={currentSlideIndex}
            />
            <AddVideo
              token={token}
              store={store}
              setStore={setStore}
              currentIndex={currentSlideIndex}
            />
            <AddCode
              token={token}
              store={store}
              setStore={setStore}
              currentIndex={currentSlideIndex}
            />
          </List>
          <Divider />
          <List>
            <DeleteSlideButton
              token={token}
              store={store}
              setStore={setStore}
              currentIndex={currentSlideIndex}
              presentationIndex={presentationIndex}
              setCurrentSlideIndex={setCurrentSlideIndex}
            />
          </List>
        </Box>
      </Drawer>
      <Box
        className="main1"
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '68px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid black'
        }}
      >
        <Box
          className="box1"
          sx={{
            border: '1px solid black',
            flexGrow: 1,
            position: 'relative',
            width: '100%',
            height: '100%',
            ...(typeof currentSlide.backgroundColour === 'string' &&
            currentSlide.backgroundColour.endsWith(')')
              ? { backgroundImage: currentSlide.backgroundColour }
              : { backgroundColor: currentSlide.backgroundColour })
          }}
        >
          <TextBoxes
            textObjects={currentSlide.text}
            token={token}
            presentationId={presentationId}
            currentSlideIndex={currentSlideIndex}
            store={store}
            setStore={setStore}
            presentationIndex={presentationIndex}
          />
          <Images
            imageObjects={currentSlide.image}
            token={token}
            presentationId={presentationId}
            currentSlideIndex={currentSlideIndex}
            store={store}
            setStore={setStore}
            presentationIndex={presentationIndex}
          />
          <Videos
            videoObjects={currentSlide.video}
            token={token}
            presentationId={presentationId}
            currentSlideIndex={currentSlideIndex}
            store={store}
            setStore={setStore}
            presentationIndex={presentationIndex}
          />
          <Codes
            codeObjects={currentSlide.code}
            token={token}
            presentationId={presentationId}
            currentSlideIndex={currentSlideIndex}
            store={store}
            setStore={setStore}
            presentationIndex={presentationIndex}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <SlideCount>
            Slide {currentSlideIndex + 1} of {totalSlides}
          </SlideCount>
          <ButtonGroup>
            {currentSlideIndex > 0
              ? (
              <button aria-label="previous-slide" onClick={handlePreviousSlide}>
                <ArrowBackIcon />
              </button>
                )
              : (
              <InvisibleButton>
                <ArrowBackIcon />
              </InvisibleButton>
                )}
            {currentSlideIndex < totalSlides - 1
              ? (
              <button aria-label="next-slide" onClick={handleNextSlide}>
                <ArrowForwardIcon />
              </button>
                )
              : (
              <InvisibleButton>
                <ArrowForwardIcon />
              </InvisibleButton>
                )}
          </ButtonGroup>
        </Box>
      </Box>
    </Box>
  );
}

const InvisibleButton = styled('button')({
  visibility: 'hidden',
  pointerEvents: 'none'
});

const SlideCount = styled('div')({
  color: '#666',
  fontSize: '1em',
  marginLeft: '5px'
});

const ButtonGroup = styled('div')({
  display: 'flex',
  gap: '20px',
  margin: 'auto'
});

export default PresentationEditor;
