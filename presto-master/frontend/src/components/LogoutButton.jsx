import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function Logout ({ token, setToken }) {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:5005/admin/auth/logout',
        {},
        {
          headers: {
            Authorization: token
          }
        }
      );
      setToken(null);
      navigate('/login');
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return <Button aria-label="logout-btn" color="inherit" onClick={logout} style={{ textDecoration: 'none', color: 'white' }}>Logout</Button>;
}

export default Logout;
