import React, { useState } from 'react';
import style from './auth.module.css';
import { LoginCredentialsDTO, State } from './types';
import { login } from './services/auth.services';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export interface notification extends SnackbarOrigin {
  open: boolean;
  message: string;
}

export function Auth({ history }: any) {
  const [values, setValues] = useState<State>({
    email: '',
    password: '',
    showPassword: false,
  });

  const [loading, setLoading] = React.useState(false);

  const [error, setError] = React.useState<notification>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
  });

  const { vertical, horizontal, open } = error;

  const signIn = async () => {
    if (!loading) {
      setLoading(true);

      if (values.email === '' || values.password === '') {
        setError({
          open: true,
          vertical: 'top',
          horizontal: 'center',
          message: 'Please, enter your email and password',
        });
        setLoading(false);
        return;
      }

      const request: LoginCredentialsDTO = {
        email: values.email,
        password: values.password,
      };

      const response: boolean = await login(request);

      if (!response) {
        setError({
          open: true,
          vertical: 'top',
          horizontal: 'center',
          message: 'Incorrect email or password, please verify information',
        });
        setLoading(false);
        return;
      }

      setLoading(false);
      history.push('/dashboard');
    }
  };

  const handleChange =
    (prop: keyof LoginCredentialsDTO) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setError({
      open: false,
      vertical: 'top',
      horizontal: 'center',
      message: '',
    });
    return;
  };

  const label = { inputProps: { 'aria-label': 'True' } };

  return (
    <Grid>
      <Paper className={style.paper}>
        <h6 className={style.title}>ACCESS</h6>
        <Grid container>
          <Paper className={style.paperEntry}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid xs={12}>
                <h6 className={style.welcome}>WELCOME</h6>
              </Grid>
              <Grid xs={12}>
                <div className={style.containerInputs}>
                  <FormControl sx={{ m: 1.5, width: '95%' }} variant="outlined">
                    <InputLabel className={style.inputColor}>Email</InputLabel>
                    <OutlinedInput
                      className={style.inputStyle}
                      type="text"
                      value={values.email}
                      onChange={handleChange('email')}
                      label="Password"
                      sx={{
                        fieldset: {
                          borderColor: 'transparent',
                          borderWidth: '0em',
                          border: 'none !important',
                        },
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: 'white !important',
                          borderWidth: '0em',
                          border: 'none !important',
                        },
                        '.MuiInputBase-input': {
                          color: 'white !important',
                          borderWidth: '0em',
                          border: 'none !important',
                        },
                        '.Mui-focused': {
                          borderWidth: '1px !important',
                          border: 'none !important',
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl sx={{ m: 1.5, width: '95%' }} variant="outlined">
                    <InputLabel className={style.inputColor}>
                      Password
                    </InputLabel>
                    <OutlinedInput
                      className={style.inputStyle}
                      id="outlined-adornment-password"
                      type={values.showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={handleChange('password')}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? (
                              <VisibilityOff style={{ color: 'white' }} />
                            ) : (
                              <Visibility style={{ color: 'white' }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      sx={{
                        fieldset: {
                          borderColor: 'transparent',
                          borderWidth: '0em',
                          border: 'none !important',
                        },
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: 'white !important',
                          borderWidth: '0em',
                          border: 'none !important',
                        },
                        '.MuiInputBase-input': {
                          color: 'white !important',
                          borderWidth: '0em',
                          border: 'none !important',
                        },
                        '.Mui-focused': {
                          borderWidth: '1px !important',
                          border: 'none !important',
                        },
                      }}
                    />
                  </FormControl>
                </div>
                <div style={{ marginTop: '-2em', marginLeft: '.5em' }}>
                  <Grid container spacing={3}>
                    <Grid xs>
                      <Grid container spacing={2}>
                        <Grid xs>
                          <Checkbox className={style.check} {...label} />
                        </Grid>
                        <Grid xs={8}>
                          <h1 className={style.remember}>Remember me</h1>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid xs={7}>
                      <button className={style.forgot}>Forgot Password?</button>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid xs={12}>
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Button
                    variant="contained"
                    className={style.button}
                    onClick={signIn}
                    disabled={loading}
                  >
                    Log in
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: '#6DC995',
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Paper>
      {error.open && (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            sx={{ width: '100%', backgroundColor: '#30364E', color: 'white' }}
          >
            {error.message}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  );
}
