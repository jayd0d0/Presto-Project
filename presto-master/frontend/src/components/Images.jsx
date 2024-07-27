import React from 'react';
import ResizeableImage from './ResizeableImage';

const Images = ({
  imageObjects,
  token,
  presentationId,
  currentSlideIndex,
  store,
  setStore,
  presentationIndex
}) => {
  return (
    <>
      {imageObjects.map((imageObject, index) => (
        <ResizeableImage
          key={index}
          imageObject={imageObject}
          token={token}
          presentationId={presentationId}
          currentSlideIndex={currentSlideIndex}
          index={index}
          store={store}
          setStore={setStore}
          presentationIndex={presentationIndex}
        />
      ))}
    </>
  );
};

export default Images;
