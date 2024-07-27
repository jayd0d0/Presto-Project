import React, { useRef, useState, useEffect } from 'react';
import Moveable from 'react-moveable';
import deleteElement from '../components/DeletingElement';
import axios from 'axios';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const ResizeableText = ({
  textObject,
  token,
  presentationId,
  currentSlideIndex,
  index,
  store,
  setStore,
  presentationIndex
}) => {
  const [selectedTextElement, setSelectedTextElement] = useState(null);
  const targetRef = useRef(null);
  const moveableRef = useRef(null);
  const [selectedFont, setSelectedFont] = useState(textObject.font || 'Arial'); // Default font
  const onClickText = () => {
    setSelectedTextElement(targetRef.current);
  };

  const handleClickOutside = (event) => {
    if (
      targetRef.current &&
      !targetRef.current.contains(event.target) &&
      !event.target.classList.contains('moveable')
    ) {
      setSelectedTextElement(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const updateTextObject = async (updatedTextObject, index) => {
    const updatedSlides = [...store.presentations[presentationIndex].slides];
    updatedSlides[currentSlideIndex].text[index] = updatedTextObject;
    setStore({
      ...store,
      presentations: store.presentations.map((presentation, i) =>
        i === presentationIndex
          ? { ...presentation, slides: updatedSlides }
          : presentation
      )
    });
    try {
      await axios.put(
        'http://localhost:5005/store',
        {
          store: {
            presentations: store.presentations
          }
        },
        {
          headers: {
            Authorization: token
          }
        }
      );
    } catch (error) {
      console.error('Error updating presentation:', error);
    }
  };

  const onDrag = ({ target, clientX, clientY }) => {
    const containerRect = document
      .querySelector('.box1')
      .getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    // Calculate the position of the target relative to the container
    let left = clientX - containerRect.left - targetRect.width / 2; // Adjusted to center the text horizontally
    let top = clientY - containerRect.top - targetRect.height / 2; // Adjusted to center the text vertically

    // Limit the movement of the text element within the boundaries of the container
    left = Math.max(0, Math.min(left, containerRect.width - targetRect.width));
    top = Math.max(0, Math.min(top, containerRect.height - targetRect.height));

    // Update the position of the target
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;

    // Calculate the new position in percentage relative to the container
    const x = (left / containerRect.width) * 100;
    const y = (top / containerRect.height) * 100;

    // Update the position of the text object with the new position
    updateTextObject(
      {
        ...textObject,
        x,
        y
      },
      index
    );
  };

  const onResize = ({ target, width, height }) => {
    // Calculate the delta values for width and height
    const deltaWidth = width - target.offsetWidth;
    const deltaHeight = height - target.offsetHeight;

    // Calculate the new width and height relative to the current size of the element
    let newWidth = textObject.width + (deltaWidth / window.innerWidth) * 100;
    let newHeight =
      textObject.height + (deltaHeight / window.innerHeight) * 100;

    // Ensure that the new width and height are not smaller than 1%
    newWidth = Math.max(newWidth, 1);
    newHeight = Math.max(newHeight, 1);

    // Update the size of the text object
    updateTextObject(
      {
        ...textObject,
        width: newWidth,
        height: newHeight
      },
      index
    );
  };

  const handleFontChange = (event) => {
    const newFont = event.target.value;
    setSelectedFont(newFont);
    updateTextObject(
      {
        ...textObject,
        font: newFont
      },
      index
    );
  };

  return (
    <>
      {selectedTextElement && (
        <Moveable
          ref={moveableRef}
          target={selectedTextElement}
          draggable={true}
          resizable={true}
          throttleDrag={0}
          throttleResize={0}
          onDrag={onDrag}
          onResize={onResize}
          renderDirections={['nw', 'ne', 'sw', 'se']}
        />
      )}
      <div
        className="target"
        ref={targetRef}
        onClick={onClickText}
        onContextMenu={(e) =>
          deleteElement(
            e,
            token,
            presentationId,
            currentSlideIndex,
            'text',
            index,
            store,
            setStore
          )
        }
        style={{
          position: 'absolute',
          left: `${textObject.x}%`,
          top: `${textObject.y}%`,
          zIndex: textObject.zIndex,
          width: `${textObject.width}%`,
          height: `${textObject.height}%`,
          overflow: 'hidden',
          border: '1px solid #D3D3D3',
        }}
      >
        <div
          style={{
            position: 'flex',
            flexDirection: 'column',
          }}
        >
          <Select
            value={selectedFont}
            onChange={handleFontChange}
            style={{
              width: '100%',
              zIndex: textObject.zIndex + 1, // Ensure the font selection menu appears above the text
            }}
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Verdana">Verdana</MenuItem>
          </Select>
          <div
            style={{
              // position: 'absolute',
              left: `${textObject.x}%`,
              top: `${textObject.y}%`,
              width: `${textObject.width}%`,
              height: `${textObject.height}%`,
              fontSize: `${textObject.fontSize}em`,
              color: textObject.colour,
              fontFamily: selectedFont,
            }}
          >
            {textObject.text}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResizeableText;
