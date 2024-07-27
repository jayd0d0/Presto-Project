import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

function UpdateTitle ({ token, store, setStore }) {
  const { presentationId } = useParams();
  const [title, setTitle] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const submitTitle = async () => {
    if (!store || !store.presentations) {
      console.error('Store or presentations are undefined.');
      return;
    }

    const updatedPresentations = store.presentations.map(presentation => {
      const presentationIdString = presentation.presentationId.toString();
      if (presentationIdString === presentationId) {
        return {
          ...presentation,
          title
        };
      }
      return presentation;
    });

    try {
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

      // Update local state
      setStore(prevStore => ({
        ...prevStore,
        presentations: updatedPresentations
      }));

      handleClose();
    } catch (error) {
      console.error('Error updating presentation:', error);
    }
  };

  return (
    <>
      <MenuItem
        color="inherit"
        onClick={handleClickOpen}
      >
        Edit Title
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Edit Title'}</DialogTitle>
        <DialogContent>
          <TextField
            id="filled-basic"
            label="Title"
            variant="filled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button aria-label="submit-title" onClick={submitTitle}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UpdateTitle;
