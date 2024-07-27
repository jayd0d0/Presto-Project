import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import UploadThumbnailInsert from './UploadThumbnailInsert';

function UploadThumbnail ({ token, store, setStore }) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => setOpen(true);

  return (
    <>
      <MenuItem color="inherit" onClick={handleClickOpen}>
        Edit Thumbnail
      </MenuItem>
      <UploadThumbnailInsert
        token={token}
        store={store}
        setStore={setStore}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

export default UploadThumbnail;
