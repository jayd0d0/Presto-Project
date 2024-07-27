import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DialogContentText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

function DeletePresentation ({ token, store }) {
  const navigate = useNavigate();
  const { presentationId } = useParams();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const removePresentation = async () => {
    if (!store || !store.presentations) {
      console.error('Store or presentations are undefined.');
      return;
    }

    const updatedPresentations = store.presentations.filter((presentation) => {
      return presentation.presentationId.toString() !== presentationId;
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
      navigate('/dashboard');
    } catch (error) {
      console.error('Error removing presentation:', error);
    }
  };

  return (
    <>
      <MenuItem
        variant="outlined"
        color="inherit"
        onClick={handleClickOpen}
      >
        🗑️Delete Presentation
      </MenuItem>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Are you sure you want to delete this
            presentation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button aria-label="reject-deletion" onClick={handleClose}>No</Button>
          <Button aria-label="continue-deletion" onClick={removePresentation} autoFocus color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeletePresentation;
