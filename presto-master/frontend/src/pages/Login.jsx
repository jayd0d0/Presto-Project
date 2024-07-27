import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';

function Login ({ token, setTokenFunction }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  if (token !== null) {
    return <Navigate to="/dashboard" />;
  }

  const login = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5005/admin/auth/login',
        {
          email,
          password
        }
      );
      setTokenFunction(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  const submitEnter = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '60vw' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center'
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h4" sx={{ textAlign: 'center' }}>
        Login To Presto
      </Typography>
      <TextField
        id="login-email"
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyUp={submitEnter}
      />
      {/* Login form */}
      <FormControl variant="outlined" sx={{ m: 1, width: '25ch' }}>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={submitEnter}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <Button aria-label="login" variant="contained" onClick={login}>
        Login
      </Button>
      <Typography
        variant="body2"
        style={{ textAlign: 'center', marginTop: '20px' }}
      >
        Don`t have an account?{' '}
        <Link
          type="button"
          variant="body2"
          onClick={() => navigate('/register')}
        >
          Click here to register.
        </Link>
      </Typography>
    </Box>
  );
}

export default Login;
