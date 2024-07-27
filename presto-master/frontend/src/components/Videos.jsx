import React from 'react';
import ResizeableVideo from './ResizeableVideo';

const Videos = ({
  videoObjects,
  token,
  presentationId,
  currentSlideIndex,
  store,
  setStore,
  presentationIndex
}) => {
  return (
    <>
      {videoObjects.map((videoObject, index) => (
        <ResizeableVideo
          key={index}
          videoObject={videoObject}
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

export default Videos;
