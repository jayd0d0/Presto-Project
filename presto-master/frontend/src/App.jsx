import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PresentationEditor from './pages/PresentationEditor';
import PresentationPreview from './pages/PresentationPreview';

function App () {
  let lsToken = null;
  if (localStorage.getItem('token')) {
    lsToken = JSON.parse(localStorage.getItem('token'));
  }
  const [token, setToken] = React.useState(lsToken);

  const setTokenAbstract = (token) => {
    setToken(token);
    localStorage.setItem('token', JSON.stringify(token));
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/edit" element={<Navigate to="/login" />} />
          <Route path="/edit/*" element={<Navigate to="/login" />} />
          <Route path="/preview" element={<Navigate to="/login" />} />
          <Route path="/preview/*" element={<Navigate to="/login" />} />
          {/* Make sure to add a register button on the login page */}
          <Route
            path="/dashboard"
            element={
              <Dashboard token={token} setTokenFunction={setTokenAbstract} />
            }
          />
          <Route
            path="/register"
            element={
              <Register token={token} setTokenFunction={setTokenAbstract} />
            }
          />
          <Route
            path="/login"
            element={
              <Login token={token} setTokenFunction={setTokenAbstract} />
            }
          />
          <Route
            path="/edit/:presentationId/:slideNo"
            element={<PresentationEditor token={token} />}
          />
          <Route
            path="/preview/:presentationId/:slideNo"
            element={<PresentationPreview token={token} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
