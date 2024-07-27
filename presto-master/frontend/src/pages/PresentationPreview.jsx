import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// import { Carousel, Button } from 'react-bootstrap';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import PreviewTextBoxes from '../components/PreviewTextBoxes';
import PreviewImages from '../components/PreviewImages';
import PreviewVideos from '../components/PreviewVideos';
import PreviewCodes from '../components/PreviewCodes';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PresentationPreview = ({ token }) => {
  if (token === null) {
    return <Navigate to="/login" />;
  }
  const { presentationId, slideNo } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [store, setStore] = React.useState({});
  const [presentationIndex, setPresentationIndex] = React.useState(-1);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(
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
      navigate(`/preview/${presentationId}/${parseInt(slideNo) + 1}`);
    }
  };

  const handlePreviousSlide = () => {
    const hasPreviousSlide = currentSlideIndex > 0;
    if (hasPreviousSlide) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
      navigate(`/preview/${presentationId}/${parseInt(slideNo) - 1}`);
    }
  };

  const arrowNavigate = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePreviousSlide();
    } else if (e.key === 'ArrowRight') {
      handleNextSlide();
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          height: '98vh',
          flexDirection: 'column',
          ...(typeof currentSlide.backgroundColour === 'string' &&
          currentSlide.backgroundColour.endsWith(')')
            ? { backgroundImage: currentSlide.backgroundColour }
            : { backgroundColor: currentSlide.backgroundColour })
        }}
        tabIndex={0}
        onKeyDown={arrowNavigate}
      >
        <Box
          className="box1"
          sx={{
            border: '1px solid black',
            flexGrow: 1,
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          <PreviewTextBoxes textObjects={currentSlide.text} />
          <PreviewImages imageObjects={currentSlide.image} />
          <PreviewVideos videoObjects={currentSlide.video} />
          <PreviewCodes codeObjects={currentSlide.code} />
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
    </>
  );
};

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

export default PresentationPreview;
