import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './SignInForm.css';
import axios from 'axios';
axios.defaults.withCredentials = true;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const [serverErrors, setServerErrors] = useState('');
  const navigate = useNavigate();
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    setServerErrors('');
    let formData = JSON.stringify({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/auth/signin',
        {
          headers: { 'content-type': 'application/json' },
          data: formData,
          method: 'POST',
        }
      );

      let userAuthState = false;
      let adminAuthState = false;

      if (response.data) {
        userAuthState = response.data.userAuth;
        adminAuthState = response.data.adminAuth;
      }

      if (response.status === 200 || response.status === 201) {
        navigate('/', {
          state: { userAuthState, adminAuthState },
        });
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setServerErrors(error.response.data.message);
      } else {
        console.log('Error', error.message);
      }
      console.log(error);
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        {serverErrors && <p className='serverErrorMSG'>{serverErrors}</p>}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <TextField
            variant='outlined'
            margin='normal'
            inputRef={register({ required: true })}
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
          />
          {errors.email && errors.email.type === 'required' && (
            <p className='signin_error'>Required!</p>
          )}

          <TextField
            variant='outlined'
            margin='normal'
            inputRef={register({ required: true })}
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
          />
          {errors.password && errors.password.type === 'required' && (
            <p className='signin_error'>Required!</p>
          )}

          <TextField
            variant='outlined'
            margin='normal'
            inputRef={register({ required: true })}
            required
            fullWidth
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            id='confirmPassword'
            autoComplete='current-confirmPassword'
          />
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'required' && (
              <p className='signin_error'>Required!</p>
            )}

          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href='#' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
