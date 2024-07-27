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
import Textarea from '@mui/joy/Textarea';
import detectLang from 'lang-detector';

const AddCode = ({ token, store, setStore, currentIndex }) => {
  const { presentationId } = useParams();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const [width, setWidth] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [code, setCode] = React.useState('');
  const [fontSize, setFontSize] = React.useState('');

  const addCode = async () => {
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
    // detect what language it is, set the language and default language and the preset the language on monaco
    const detectedLanguage = detectLang(code);
    let codeLan = '';
    if (detectedLanguage === 'C') {
      codeLan = 'c';
    } else if (detectedLanguage === 'Python') {
      codeLan = 'python';
    } else if (detectedLanguage === 'JavaScript') {
      codeLan = 'javascript';
    } else {
      console.error('Code written is not in C, Python or Javascript!');
      return;
    }

    try {
      const updatedPresentations = store.presentations.map((presentation) => {
        if (presentation.presentationId === parseInt(presentationId)) {
          const totalElements = presentation.slides[currentIndex].text.length +
                                presentation.slides[currentIndex].image.length +
                                presentation.slides[currentIndex].video.length +
                                presentation.slides[currentIndex].code.length;
          const newCode = {
            width: parseFloat(width),
            height: parseFloat(height),
            fontSize: parseFloat(fontSize),
            code,
            language: codeLan,
            x: 0,
            y: 0,
            zIndex: totalElements
          }; // Initialize new slide with empty code
          presentation.slides[currentIndex].code.push(newCode); // Add new slide to existing slides
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
      setCode('');
      setFontSize('');
      handleClose();
    } catch (error) {
      console.error('Error adding code:', error);
    }
  };
  function isNumeric (value) {
    // Regular expression to match floating-point numbers
    return /^-?\d+(\.\d+)?$/.test(value);
  }

  return (
    <>
      <ListItemButton onClick={handleClickOpen}>
        <ListItemText primary="Add Code" />
      </ListItemButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Code'}</DialogTitle>
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
          <Textarea
            color="primary"
            minRows={2}
            placeholder="Write your code here..."
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <br />
          <TextField
            id="filled-basic"
            label="Font size in em as a decimal"
            variant="filled"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button aria-label="add-code-btn" onClick={addCode}>Add Code</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddCode;
