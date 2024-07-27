import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useNavigate } from 'react-router-dom';
import UpdateTitle from './UpdateTitleModal';
import UploadThumbnail from './UploadThumbnailModal';
import DeletePresentation from './DeletePresentationModal';

export default function MenuPopupState ({ token, store, setStore }) {
  const navigate = useNavigate();
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <IconButton variant="contained" {...bindTrigger(popupState)}>
            <MenuIcon />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              color="inherit"
              onClick={() => navigate('/dashboard')}
            >
              Home
            </MenuItem>
            <UpdateTitle token={token} store={store} setStore={setStore} />
            <UploadThumbnail token={token} store={store} setStore={setStore} />
            <DeletePresentation token={token} store={store} />
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
