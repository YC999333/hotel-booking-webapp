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
import './SignUpForm.css';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
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

export default function SignUp() {
  const [serverErrors, setServerErrors] = useState('');
  const navigate = useNavigate();
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm({ defaultValues: {} });
  const onSubmit = async (data) => {
    setServerErrors('');
    let formData = JSON.stringify({
      email: data.email,
      username: data.username,
      password: data.password,
    });
    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/auth/signup',
        {
          headers: { 'content-type': 'application/json' },
          data: formData,
          method: 'PUT',
        }
      );

      if (response.status === 200 || response.status === 201) {
        navigate('/signin');
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
          Sign up
        </Typography>
        {serverErrors && <p className='serverErrorMSG'>{serverErrors}</p>}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                autoComplete='username'
                name='username'
                variant='outlined'
                required
                inputRef={register({ required: true, minLength: 2 })}
                fullWidth
                id='username'
                label='username'
                autoFocus
              />
              {errors.username && errors.username.type === 'required' && (
                <p className='signup_error'>Required!</p>
              )}
              {errors.username && errors.username.type === 'minLength' && (
                <p className='signup_error'>Minimum length: 2.</p>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                inputRef={register({ required: true })}
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
              />
              {errors.email && errors.email.type === 'required' && (
                <p className='signup_error'>Required!</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                inputRef={register({ required: true, minLength: 5 })}
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
              />
              {errors.password && errors.password.type === 'required' && (
                <p className='signup_error'>Required!</p>
              )}
              {errors.password && errors.password.type === 'minLength' && (
                <p className='signup_error'>Minimum length: 5.</p>
              )}
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link href='/signin' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
