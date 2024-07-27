import React from 'react';
const PreviewImages = ({ imageObjects }) => {
  return (
    <>
      {imageObjects.map((imageObject, index) => (
        <img
          key={index}
          src={imageObject.image}
          alt={imageObject.altText}
          style={{
            position: 'absolute',
            width: `${imageObject.width}%`,
            height: `${imageObject.height}%`,
            zIndex: `${imageObject.zIndex}`,
            left: `${imageObject.x}%`,
            top: `${imageObject.y}%`
          }}
        />
      ))}
    </>
  );
};

export default PreviewImages;
