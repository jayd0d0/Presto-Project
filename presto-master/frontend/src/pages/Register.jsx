import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

function Register ({ token, setTokenFunction }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');

  const navigate = useNavigate();
  // Manage the visibility of the password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirm = () =>
    setShowPasswordConfirm((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if (token !== null) {
    return <Navigate to="/dashboard" />;
  }

  const register = async () => {
    if (email === '') {
      alert('Please insert an email to register');
      return;
    }

    if (passwordConfirm !== password) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:5005/admin/auth/register',
        {
          email,
          password,
          name
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
      register();
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
        Register For Presto
      </Typography>
      {/* Register inputs */}
      <Box
        sx={{
          '& > :not(style)': { m: 1, width: '60vw' },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TextField
          id="register-email"
          label="Email"
          variant="outlined"
          onChange={(e) => setEmail(e.currentTarget.value)}
          onKeyUp={submitEnter}
        />
        <TextField
          id="register-name"
          label="Name"
          variant="outlined"
          onChange={(e) => setName(e.currentTarget.value)}
          onKeyUp={submitEnter}
        />
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.currentTarget.value)}
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
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Confirm Password
          </InputLabel>
          <OutlinedInput
            id="register-password-confirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
            onKeyUp={submitEnter}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPasswordConfirm}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          />
        </FormControl>
      </Box>
      {/* Button stack */}
      <Stack
        spacing={2}
        direction="row"
        sx={{
          justifyContent: 'center'
        }}
      >
        <Button variant="outlined" aria-label="navigate-to-login" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
        <Button variant="contained" aria-label="register-button" onClick={register}>
          Register
        </Button>
      </Stack>
    </Box>
  );
}

export default Register;
