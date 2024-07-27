import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ListItemButton, ListItemText, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';

const AddImage = ({ token, store, setStore, currentIndex }) => {
  const { presentationId } = useParams();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const [width, setWidth] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [imageFile, setImageFile] = React.useState('');
  const [filename, setFilename] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [altText, setAltText] = React.useState('');

  const addImage = async () => {
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
    if (!imageFile && !imageUrl) {
      alert('Please select an image from your device or enter an image URL!');
      return;
    }
    if (imageFile && imageUrl) {
      alert(
        'Please only select ONE image from your device or enter an image URL to upload!'
      );
      return;
    }

    if (imageFile && !imageUrl) {
      // Capture the file name when a file is uploaded
      const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const valid = validFileTypes.find((type) => type === imageFile.type);
      // Bad data, let's walk away.
      if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
      }
    }
    if (altText === '') {
      alert('You must have a description of your image!');
      return;
    }

    try {
      let base64Image = '';
      if (imageFile) {
        base64Image = await convertImageToBase64(imageFile);
      } else {
        base64Image = imageUrl;
      }
      const updatedPresentations = store.presentations.map((presentation) => {
        if (presentation.presentationId === parseInt(presentationId)) {
          const totalElements =
            presentation.slides[currentIndex].text.length +
            presentation.slides[currentIndex].image.length +
            presentation.slides[currentIndex].video.length +
            presentation.slides[currentIndex].code.length;

          const newImage = {
            width: parseFloat(width),
            height: parseFloat(height),
            image: base64Image,
            altText,
            x: 0,
            y: 0,
            zIndex: totalElements
          };
          presentation.slides[currentIndex].image.push(newImage);
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
      setImageFile('');
      setImageUrl('');
      setFilename('');
      setAltText('');
      handleClose();
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };
  function isNumeric (value) {
    // Regular expression to match floating-point numbers
    return /^-?\d+(\.\d+)?$/.test(value);
  }
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilename(file.name);
    }
  };

  const removeFile = () => {
    setFilename('');
    setImageFile(''); // Reset the file state
  };

  return (
    <>
      <ListItemButton onClick={handleClickOpen}>
        <ListItemText primary="Insert Image" />
      </ListItemButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Image'}</DialogTitle>
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
          <Button
            aria-label="Upload-Img-btn"
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onChange={(e) => {
              handleFileChange(e);
              setImageFile(e.target.files[0]);
            }}
          >
            Upload Image
            <input type="file" hidden />
          </Button>
          <br />
          <span>{filename}</span>
          {filename && (
            <IconButton onClick={removeFile} size="small">
              <ClearIcon />
            </IconButton>
          )}
          <br />
          <TextField
            id="filled-basic"
            label="Or enter image URL"
            variant="filled"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <br />
          <TextField
            id="filled-basic"
            label="Description"
            variant="filled"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addImage}>Add Image</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddImage;
