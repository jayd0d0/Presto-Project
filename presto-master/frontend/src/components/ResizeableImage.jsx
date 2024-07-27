import React, { useRef, useState, useEffect } from 'react';
import Moveable from 'react-moveable';
import deleteElement from '../components/DeletingElement';
import axios from 'axios';

const ResizableImage = ({
  imageObject,
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
  const updateImageObject = async (updatedImageObject, index) => {
    const updatedSlides = [...store.presentations[presentationIndex].slides];
    updatedSlides[currentSlideIndex].image[index] = updatedImageObject;
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
    updateImageObject(
      {
        ...imageObject,
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
    let newWidth = imageObject.width + (deltaWidth / window.innerWidth) * 100;
    let newHeight =
      imageObject.height + (deltaHeight / window.innerHeight) * 100;

    // Ensure that the new width and height are not smaller than 1%
    newWidth = Math.max(newWidth, 1);
    newHeight = Math.max(newHeight, 1);

    // Update the size of the text object
    updateImageObject(
      {
        ...imageObject,
        width: newWidth,
        height: newHeight
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
      <img
        className="target"
        ref={targetRef}
        onClick={onClickText}
        style={{
          position: 'absolute',
          width: `${imageObject.width}%`,
          height: `${imageObject.height}%`,
          zIndex: `${imageObject.zIndex}`,
          left: `${imageObject.x}%`,
          top: `${imageObject.y}%`
        }}
        onContextMenu={(e) =>
          deleteElement(
            e,
            token,
            presentationId,
            currentSlideIndex,
            'image',
            index,
            store,
            setStore
          )
        }
        src={imageObject.image}
        alt={imageObject.altText}
      />
    </>
  );
};

export default ResizableImage;
