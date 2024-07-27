import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import slideImage from '../assets/slide-default.jpg';

function NewPresentation ({ token, store, setStore }) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const fetchStoreData = () => {
    axios
      .get('http://localhost:5005/store', {
        headers: {
          Authorization: token
        }
      })
      .then((response) => {
        setStore(response.data.store);
      })
      .catch((error) => {
        console.error('Error fetching store data:', error);
      });
  };

  const createPresentation = async () => {
    let presentationId = 0;
    let newPresentations = [];
    if (store.presentations !== undefined) {
      presentationId =
        store.presentations[store.presentations.length - 1].presentationId + 1;
      newPresentations = [...store.presentations];
    }

    const untitledPresentation = 'Untitled';
    let presentationTitle = title;
    if (presentationTitle === '') {
      presentationTitle = untitledPresentation;
    }

    newPresentations.push({
      presentationId,
      title: presentationTitle,
      description,
      thumbnail: slideImage,
      defaultBackgroundColour: '#FFFFFF',
      slides: [
        {
          backgroundColour: '#FFFFFF',
          text: [],
          image: [],
          video: [],
          code: []
        }
      ]
    });

    await axios
      .put(
        'http://localhost:5005/store',
        {
          store: { presentations: newPresentations }
        },
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(() => {
        fetchStoreData();
        handleClose();
      })
      .catch((error) => {
        console.error('Error creating presentation:', error);
      });
  };

  return (
    <>
      <Button
        color="inherit"
        style={{ textDecoration: 'none', color: 'white' }}
        onClick={handleClickOpen}
      >
        New Presentation
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'New Presentation'}</DialogTitle>
        <DialogContent>
          <TextField
            id="filled-basic"
            label="Title"
            variant="filled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <TextField
            id="filled-basic"
            label="Description (Optional)"
            variant="filled"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button aria-label="create-presentation" onClick={createPresentation}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NewPresentation;
