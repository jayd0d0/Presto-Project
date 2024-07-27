import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ListItemButton, ListItemText } from '@mui/material';

function AddSlideButton ({ token, store, setStore }) {
  const { presentationId } = useParams();

  const addSlide = async () => {
    try {
      const updatedPresentations = store.presentations.map((presentation) => {
        if (presentation.presentationId === parseInt(presentationId)) {
          const newSlide = {
            backgroundColour: presentation.defaultBackgroundColour,
            text: [],
            image: [],
            video: [],
            code: []
          };
          const newSlides = [...presentation.slides, newSlide];
          return {
            ...presentation,
            slides: newSlides
          };
        }
        return presentation;
      });

      await axios.put(
        'http://localhost:5005/store',
        {
          store: {
            presentations: updatedPresentations
          }
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      setStore((prevStore) => ({
        ...prevStore,
        presentations: updatedPresentations
      }));
    } catch (error) {
      console.error('Error adding slide:', error);
    }
  };

  return (
    <>
      <ListItemButton onClick={addSlide}>
        <ListItemText primary="Insert Slide" />
      </ListItemButton>
    </>
  );
}

export default AddSlideButton;
