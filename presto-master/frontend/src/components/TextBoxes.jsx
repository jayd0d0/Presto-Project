import React from 'react';
// import deleteElement from '../components/DeletingElement';
import ResizeableText from './ResizeableText';
// import Moveable from 'react-moveable';
const TextBoxes = ({
  textObjects,
  token,
  presentationId,
  currentSlideIndex,
  store,
  setStore,
  presentationIndex
}) => {
  return (
    <>
      {textObjects.map((textObject, index) => (
        <ResizeableText
          key={index}
          textObject={textObject}
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

export default TextBoxes;
