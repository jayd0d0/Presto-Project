// Present.jsx
import React from 'react';
import { Button } from '@mui/material';

const Present = ({ presentationId, slideNo }) => {
  return (
    <>
      <Button
        variant="contained"
        href={`/preview/${presentationId}/${slideNo}`}
        target="_blank"
      >
        Present
      </Button>
    </>
  );
};

export default Present;
