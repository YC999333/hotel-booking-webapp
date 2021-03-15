import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
      title: data.title,
      location: data.location,
      imageUrl: data.imageUrl,
      price: data.price,
      description: data.description,
    });
    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/admin',
        {
          headers: { 'content-type': 'application/json' },
          data: formData,
          method: 'PUT',
        }
      );

      if (response.status === 200 || response.status === 201) {
        navigate('/');
      } else {
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
        <Typography component='h1' variant='h5'>
          Add Hotel Info
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
                autoComplete='title'
                name='title'
                variant='outlined'
                required
                inputRef={register({ required: true, minLength: 2 })}
                fullWidth
                id='title'
                label='Title'
                autoFocus
              />
              {errors.title && errors.title.type === 'required' && (
                <p className='admin_error'>Required!</p>
              )}
              {errors.title && errors.title.type === 'minLength' && (
                <p className='admin_error'>Minimum length: 2.</p>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                inputRef={register({ required: true })}
                id='location'
                label='Location'
                name='location'
                autoComplete='location'
              />
              {errors.location && errors.location.type === 'required' && (
                <p className='admin_error'>Required!</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                inputRef={register({ required: true, minLength: 5 })}
                fullWidth
                name='imageUrl'
                label='imageUrl'
                type='imageUrl'
                id='imageUrl'
                autoComplete='imageUrl'
              />
              {errors.imageUrl && errors.imageUrl.type === 'required' && (
                <p className='admin_error'>Required!</p>
              )}
              {errors.imageUrl && errors.imageUrl.type === 'minLength' && (
                <p className='admin_error'>Minimum length: 5.</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                inputRef={register({ required: true, minLength: 1 })}
                fullWidth
                name='price'
                label='Price'
                type='number'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>$</InputAdornment>
                  ),
                }}
                step='1'
                id='price'
                autoComplete='price'
              />
              {errors.price && errors.price.type === 'required' && (
                <p className='admin_error'>Required!</p>
              )}
              {errors.price && errors.price.type === 'minLength' && (
                <p className='admin_error'>Minimum length: 5.</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                inputRef={register({ required: true, minLength: 5 })}
                fullWidth
                name='description'
                label='Description'
                type='description'
                id='description'
                autoComplete='description'
              />
              {errors.description && errors.description.type === 'required' && (
                <p className='admin_error'>Required!</p>
              )}
              {errors.description &&
                errors.description.type === 'minLength' && (
                  <p className='admin_error'>Minimum length: 5.</p>
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
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}
