import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function DeleteSlideButton ({ token, store, setStore, currentIndex, presentationIndex, setCurrentSlideIndex }) {
  const { presentationId } = useParams();
  const [open, setOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  const deleteSlide = async () => {
    try {
      const updatedPresentations = store.presentations.map(presentation => {
        if (presentation.presentationId === parseInt(presentationId)) {
          const newSlides = [...presentation.slides]; // Copy slides array
          newSlides.splice(currentIndex, 1); // Remove the slide at currentIndex
          if (newSlides.length === 0) {
            setErrorOpen(true); // Show error dialog if there's only one slide left
            return presentation; // Don't modify the presentation if there's only one slide left
          }
          return {
            ...presentation,
            slides: newSlides
          };
        }
        return presentation;
      });

      const numSlidesAfterDeletion = updatedPresentations[presentationIndex].slides.length;
      if (currentIndex >= numSlidesAfterDeletion) {
        // Reset currentIndex to 0 if it exceeds the number of slides
        setCurrentSlideIndex(0);
      }
      setStore(prevStore => ({
        ...prevStore,
        presentations: updatedPresentations
      }));

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
      handleClose();
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  return (
    <>
      <ListItemButton onClick={handleOpen}>
        <ListItemText primary='Delete Slide' />
      </ListItemButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this slide?
        </DialogContent>
        <DialogActions>
          <Button aria-label="cancel-delete" onClick={handleClose}>Cancel</Button>
          <Button aria-label="delete-btn" onClick={deleteSlide} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={errorOpen} onClose={handleErrorClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          This is the last slide in the presentation. Deleting it will delete the entire presentation.
        </DialogContent>
        <DialogActions>
          <Button aria-label="close" onClick={handleErrorClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteSlideButton;
