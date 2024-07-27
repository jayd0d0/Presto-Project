import axios from 'axios';

const deleteElement = (
  e,
  token,
  presentationId,
  currentIndex,
  elementType,
  elementIndex,
  store,
  setStore
) => {
  e.preventDefault();
  const clickedElement = e.target;
  if (clickedElement.tagName.toLowerCase() === 'iframe') {
    elementIndex = Array.from(clickedElement.parentNode.children).indexOf(
      clickedElement
    );
  }

  if (clickedElement.tagName.toLowerCase() === 'editor') {
    elementIndex = Array.from(clickedElement.parentNode.children).indexOf(
      clickedElement
    );
  }

  const updatedPresentations = store.presentations.map((presentation) => {
    if (presentation.presentationId === parseInt(presentationId)) {
      const updatedSlides = [...presentation.slides];
      const elementArray = updatedSlides[currentIndex][elementType];
      if (elementArray) {
        elementArray.splice(elementIndex, 1);
      }
      return {
        ...presentation,
        slides: updatedSlides
      };
    }
    return presentation;
  });

  axios
    .put(
      'http://localhost:5005/store',
      {
        store: {
          presentations: updatedPresentations
        }
      },
      {
        headers: {
          Authorization: token
        }
      }
    )
    .then(() => {
      setStore((prevStore) => ({
        ...prevStore,
        presentations: updatedPresentations
      }));
    })
    .catch((error) => {
      console.error('Error deleting element:', error);
    });
};

export default deleteElement;
