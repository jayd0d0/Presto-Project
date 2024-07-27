import React from 'react';
import ResizeableCode from './ResizeableCode';

const Codes = ({
  codeObjects,
  token,
  presentationId,
  currentSlideIndex,
  store,
  setStore,
  presentationIndex
}) => {
  return (
    <>
      {codeObjects.map((codeObject, index) => (
        <ResizeableCode
          key={index}
          codeObject={codeObject}
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

export default Codes;
