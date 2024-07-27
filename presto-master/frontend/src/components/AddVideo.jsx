import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ListItemButton, ListItemText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

const AddVideo = ({ token, store, setStore, currentIndex }) => {
  const { presentationId } = useParams();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const [width, setWidth] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [autoPlay, setAutoPlay] = React.useState(false);

  const addVideo = async () => {
    if (parseFloat(width) < 0 || parseFloat(width) > 100 || !isNumeric(width)) {
      alert('The width size inserted must be a number between 0-100!');
      return;
    }
    if (
      parseFloat(height) < 0 ||
      parseFloat(height) > 100 ||
      !isNumeric(height)
    ) {
      alert('The height size inserted must be a number between 0-100!');
      return;
    }
    if (videoUrl === '') {
      alert('You must provide a Youtube URL!');
      return;
    }

    try {
      const updatedPresentations = store.presentations.map((presentation) => {
        if (presentation.presentationId === parseInt(presentationId)) {
          const totalElements =
            presentation.slides[currentIndex].text.length +
            presentation.slides[currentIndex].image.length +
            presentation.slides[currentIndex].video.length +
            presentation.slides[currentIndex].code.length;
          const newVideo = {
            width: parseFloat(width),
            height: parseFloat(height),
            videoUrl,
            autoPlay,
            x: 0,
            y: 0,
            zIndex: totalElements
          };
          presentation.slides[currentIndex].video.push(newVideo);
          return {
            ...presentation
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
      setWidth('');
      setHeight('');
      setVideoUrl('');
      setAutoPlay(false);
      handleClose();
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };
  function isNumeric (value) {
    // Regular expression to match floating-point numbers
    return /^-?\d+(\.\d+)?$/.test(value);
  }
  const toggleAutoPlay = (event) => {
    setAutoPlay(event.target.checked);
  };

  return (
    <>
      <ListItemButton onClick={handleClickOpen}>
        <ListItemText primary="Insert Video" />
      </ListItemButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Video'}</DialogTitle>
        <DialogContent>
          <TextField
            id="filled-basic"
            label="Width (0 - 100) in percentage"
            variant="filled"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          <br />
          <TextField
            id="filled-basic"
            label="Height (0 - 100) in percentage"
            variant="filled"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <br />
          <TextField
            id="filled-basic"
            label="Enter video URL"
            variant="filled"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <br />
          <div>
            Autoplay: <Checkbox onChange={toggleAutoPlay} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button aria-label="add-vid-btn" onClick={addVideo}>Add Video</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddVideo;
