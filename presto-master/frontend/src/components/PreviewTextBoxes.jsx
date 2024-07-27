import React from 'react';
const PreviewTextBoxes = ({ textObjects }) => {
  return (
    <>
      {textObjects.map((textObject, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${textObject.x}%`,
            top: `${textObject.y}%`,
            fontSize: `${textObject.fontSize}em`,
            color: textObject.colour,
            width: `${textObject.width}%`,
            height: `${textObject.height}%`,
            overflow: 'hidden',
            zIndex: `${textObject.zIndex}`,
            fontFamily: `${textObject.font}`
          }}
        >
          {textObject.text}
        </div>
      ))}
    </>
  );
};

export default PreviewTextBoxes;
