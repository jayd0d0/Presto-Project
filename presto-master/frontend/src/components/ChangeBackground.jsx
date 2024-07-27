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
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

const ChangeBackground = ({ token, store, setStore, currentIndex }) => {
  const { presentationId } = useParams();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const [newBackground, setNewBackground] = React.useState('#');
  const [applyAll, setApplyAll] = React.useState(false);
  const [gradColour, setGradColour] = React.useState('#');
  const [applyGrad, setApplyGrad] = React.useState(false);
  const [gradDirection, setGradDirection] = React.useState('to bottom');

  const changeBackground = async () => {
    const hexColourRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (
      !hexColourRegex.test(newBackground) ||
      (applyGrad && !hexColourRegex.test(gradColour))
    ) {
      alert('The colour must be a valid hexadecimal colour code!');
      return;
    }

    try {
      const updatedPresentations = store.presentations.map((presentation) => {
        if (presentation.presentationId === parseInt(presentationId)) {
          let newBackgroundColour = newBackground;
          if (applyGrad) {
            // top to bottom
            newBackgroundColour = `linear-gradient(to bottom, ${newBackground}, ${gradColour})`;
            if (gradDirection === 'to top') {
              // bottom to top
              newBackgroundColour = `linear-gradient(to top, ${newBackground}, ${gradColour})`;
            } else if (gradDirection === 'to right') {
              // left to right
              newBackgroundColour = `linear-gradient(to right, ${newBackground}, ${gradColour})`;
            } else if (gradDirection === 'to left') {
              // right to left
              newBackgroundColour = `linear-gradient(to left, ${newBackground}, ${gradColour})`;
            } else if (gradDirection === 'to bottom right') {
              newBackgroundColour = `linear-gradient(to bottom right, ${newBackground}, ${gradColour})`;
            } else if (gradDirection === 'to top right') {
              newBackgroundColour = `linear-gradient(to top right, ${newBackground}, ${gradColour})`;
            } else if (gradDirection === 'to bottom left') {
              newBackgroundColour = `linear-gradient(to bottom left, ${newBackground}, ${gradColour})`;
            } else if (gradDirection === 'to top left') {
              newBackgroundColour = `linear-gradient(to top left, ${newBackground}, ${gradColour})`;
            }
          }
          if (applyAll) {
            presentation.defaultBackgroundColour = newBackgroundColour;
            presentation.slides.forEach((slide) => {
              slide.backgroundColour = newBackgroundColour;
            });
          } else {
            presentation.slides[currentIndex].backgroundColour =
              newBackgroundColour;
          }
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
      setNewBackground('#');
      setApplyAll(false);
      setGradColour('#');
      setApplyGrad(false);

      handleClose();
    } catch (error) {
      console.error('Error adding text:', error);
    }
  };

  const toggleApplyAll = (event) => {
    setApplyAll(event.target.checked);
  };

  const toggleApplyGrad = (event) => {
    setApplyGrad(event.target.checked);
  };

  return (
    <>
      <ListItemButton onClick={handleClickOpen}>
        <ListItemText primary="Change Background" />
      </ListItemButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Change Background'}</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              id="filled-basic"
              label="New Background Colour"
              variant="filled"
              value={newBackground.toUpperCase()}
              onChange={(e) => setNewBackground(e.target.value)}
            />
            <input
              type="color"
              value={newBackground}
              onChange={(e) => setNewBackground(e.target.value)}
            />
          </div>
          <br />
          <div>
            <div>
              Apply Gradient: <Checkbox onChange={toggleApplyGrad} />
            </div>
            <TextField
              id="filled-basic"
              label="Gradient Applied"
              variant="filled"
              value={gradColour.toUpperCase()}
              onChange={(e) => setGradColour(e.target.value)}
              disabled={!applyGrad}
            />
            <input
              type="color"
              value={gradColour}
              onChange={(e) => setGradColour(e.target.value)}
              disabled={!applyGrad}
            />
          </div>
          <br />
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Gradient Direction
            </InputLabel>
            <NativeSelect
              defaultValue={gradDirection}
              value={gradDirection}
              onChange={(e) => setGradDirection(e.target.value)}
              inputProps={{
                name: 'Gradient Direction',
                id: 'uncontrolled-native'
              }}
              disabled={!applyGrad}
            >
              <option value={'to bottom'}>Top to Bottom</option>
              <option value={'to top'}>Bottom to Top</option>
              <option value={'to right'}>Left to Right</option>
              <option value={'to left'}>Right to Left</option>

              <option value={'to bottom right'}>
                Top Left to Bottom Right
              </option>
              <option value={'to top right'}>Bottom Left to Top Right</option>
              <option value={'to bottom left'}>Top Right to Bottom Left</option>
              <option value={'to top left'}>Bottom Right to Top Left</option>
            </NativeSelect>
          </FormControl>
          <br />
          <div>
            Apply to all slides: <Checkbox onChange={toggleApplyAll} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button aria-label="background-change-btn" onClick={changeBackground}>Change Background</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangeBackground;
