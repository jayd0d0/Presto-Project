import { styled } from '@mui/material/styles';
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';

const UploadThumbnailInsert = ({ token, store, setStore, open, setOpen }) => {
  const { presentationId } = useParams();
  const [uploadedFileName, setUploadedFileName] = React.useState('');
  const [thumbnailFile, setThumbnailFile] = React.useState('');

  const handleClose = () => setOpen(false);

  const fileToDataUrl = (file) => {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const valid = validFileTypes.find((type) => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
      throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setThumbnailFile(file);
    }
  };

  const removeFile = () => {
    setThumbnailFile('');
    setUploadedFileName('');
  };

  const submitThumbnail = async () => {
    if (!thumbnailFile) {
      console.error('No thumbnail file selected.');
      return;
    }

    const thumbnailImage = await fileToDataUrl(thumbnailFile);
    if (!store || !store.presentations) {
      console.error('Store or presentations are undefined.');
      return;
    }

    const updatedPresentations = store.presentations.map((presentation) => {
      const presentationIdString = presentation.presentationId.toString();
      if (presentationIdString === presentationId) {
        return {
          ...presentation,
          thumbnail: thumbnailImage
        };
      }
      return presentation;
    });
    console.log('Updated presentations:', updatedPresentations);
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
      setStore((prevStore) => ({
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Edit Thumbnail'}</DialogTitle>
        <DialogContent>
          <Button
            component="label"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            color="inherit"
            style={{ textDecoration: 'none', marginRight: '8px' }}
            onChange={(e) => {
              handleFileChange(e);
            }}
          >
            Upload New Image
            <VisuallyHiddenInput type="file" />
          </Button>
          {uploadedFileName && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{uploadedFileName}</span>
              <IconButton onClick={removeFile}>
                <ClearIcon />
              </IconButton>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={submitThumbnail}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadThumbnailInsert;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});
