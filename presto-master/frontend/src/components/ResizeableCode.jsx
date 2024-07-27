import React, { useRef, useState, useEffect } from 'react';
import Moveable from 'react-moveable';
import deleteElement from '../components/DeletingElement';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const ResizeableCode = ({
  codeObject,
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
  const updateCodeObject = async (updatedCodeObject, index) => {
    const updatedSlides = [...store.presentations[presentationIndex].slides];
    updatedSlides[currentSlideIndex].code[index] = updatedCodeObject;
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

    // Calculate the position of the cursor relative to the top-left corner of the video box
    let left = clientX - containerRect.left - targetRect.width / 2; // Adjusted to center the video horizontally
    let top = clientY - containerRect.top; // Positioned at the top of the video vertically

    // Limit the movement of the video element within the boundaries of the container
    left = Math.max(0, Math.min(left, containerRect.width - targetRect.width));
    top = Math.max(0, Math.min(top, containerRect.height - targetRect.height));

    // Update the position of the video
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;

    // Calculate the new position in percentage relative to the container
    const x = (left / containerRect.width) * 100;
    const y = (top / containerRect.height) * 100;

    // Update the position of the video object with the new position
    updateCodeObject(
      {
        ...codeObject,
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
    let newWidth = codeObject.width + (deltaWidth / window.innerWidth) * 100;
    let newHeight =
      codeObject.height + (deltaHeight / window.innerHeight) * 100;

    // Ensure that the new width and height are not smaller than 1%
    newWidth = Math.max(newWidth, 1);
    newHeight = Math.max(newHeight, 1);

    // Update the size of the text object
    updateCodeObject(
      {
        ...codeObject,
        width: newWidth,
        height: newHeight
      },
      index
    );
  };

  const height = `${window.innerHeight * (codeObject.height / 100)}px`;
  const width = `${window.innerWidth * (codeObject.width / 100)}px`;

  const options = {
    fontSize: `${codeObject.fontSize * 16}px`,
    minimap: {
      enabled: false
    },
    readOnly: false
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
            'code',
            index,
            store,
            setStore
          )
        }
        style={{
          position: 'absolute',
          overflow: 'hidden',
          zIndex: `${codeObject.zIndex}`,
          border: '5px solid #D3D3D3',
          left: `${codeObject.x}%`,
          top: `${codeObject.y}%`,
        }}
      >
        <Editor
          key={index}
          options={options}
          height={height}
          width={width}
          defaultLanguage={codeObject.language}
          defaultValue={codeObject.code}
          language={codeObject.language}
        />
      </div>
    </>
  );
};

export default ResizeableCode;
