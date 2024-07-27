import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import NavComponent from '../components/NavComponent';
import PresentationList from '../components/PresentationList';

function Dashboard ({ token, setTokenFunction }) {
  if (token === null) {
    return <Navigate to="/login" />;
  }
  const [store, setStore] = React.useState({});

  const fetchStoreData = async () => {
    await axios
      .get('http://localhost:5005/store', {
        headers: {
          Authorization: token
        }
      })
      .then((response) => {
        setStore(response.data.store);
      })
      .catch((error) => {
        console.error('Error fetching store data:', error);
      });
  };

  React.useEffect(() => {
    fetchStoreData();
  }, [token]);

  if (store.presentations && store.presentations.length === 0) {
    axios
      .put(
        'http://localhost:5005/store',
        {
          store: {}
        },
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(() => {
        fetchStoreData();
      })
      .catch((error) => {
        console.error('Error removing presentations:', error);
      });
  }

  return (
    <>
      <NavComponent
        token={token}
        setToken={setTokenFunction}
        store={store}
        setStore={setStore}
      />
      <PresentationList store={store} />
    </>
  );
}

export default Dashboard;
