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

const AddTextBox = ({ token, store, setStore, currentIndex }) => {
  const { presentationId } = useParams();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const [width, setWidth] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [text, setText] = React.useState('');
  const [fontSize, setFontSize] = React.useState('');
  const [colour, setColour] = React.useState('');

  const addTextBox = async () => {
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
    if (parseFloat(fontSize) < 0 || !isNumeric(fontSize)) {
      alert('The font size must be a positive decimal number!');
      return;
    }

    const hexColourRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hexColourRegex.test(colour)) {
      alert('The colour must be a valid hexadecimal colour code!');
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

          const newText = {
            width: parseFloat(width),
            height: parseFloat(height),
            text,
            fontSize: parseFloat(fontSize),
            colour,
            x: 0,
            y: 0,
            zIndex: totalElements
          }; // Initialize new slide with empty text
          presentation.slides[currentIndex].text.push(newText); // Add new slide to existing slides
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
      setText('');
      setFontSize('');
      setColour('');
      handleClose();
    } catch (error) {
      console.error('Error adding text:', error);
    }
  };
  function isNumeric (value) {
    // Regular expression to match floating-point numbers
    return /^-?\d+(\.\d+)?$/.test(value);
  }

  return (
    <>
      <ListItemButton onClick={handleClickOpen}>
        <ListItemText primary="Add Text" />
      </ListItemButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Text'}</DialogTitle>
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
            label="Text"
            variant="filled"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <br />
          <TextField
            id="filled-basic"
            label="Font size in em as a decimal"
            variant="filled"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          />
          <br />
          <TextField
            id="filled-basic"
            label="Text Colour in HEX colour code"
            variant="filled"
            value={colour}
            onChange={(e) => setColour(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button aria-label="add-text-btn" onClick={addTextBox}>Add Text</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTextBox;
