import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import './Edit.css';
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

export default function Edit() {
  const { hotelId } = useParams();
  const [serverErrors, setServerErrors] = useState('');
  const [hotelTitle, setHotelTitle] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelImageUrl, setHotelImageUrl] = useState('');
  const [hotelPrice, setHotelPrice] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const navigate = useNavigate();
  const classes = useStyles();
  const { register, handleSubmit, setValue, errors } = useForm();

  useEffect(() => {
    const getHotelInfo = async () => {
      try {
        const response = await axios(
          `http://localhost:5000/admin/edit/${hotelId}`,
          {
            headers: { 'content-type': 'application/json' },
            method: 'GET',
          }
        );

        const hotelInfo = response.data.hotelInfo;
        console.log(hotelInfo);

        setHotelTitle(hotelInfo.title);
        setHotelLocation(hotelInfo.location);
        setHotelImageUrl(hotelInfo.imageUrl);
        setHotelPrice(hotelInfo.price);
        setHotelDescription(hotelInfo.description);
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
    getHotelInfo();
  }, []);

  const onClick = () => {
    setValue('title', hotelTitle);
    setValue('location', hotelLocation);
    setValue('imageUrl', hotelImageUrl);
    setValue('price', hotelPrice);
    setValue('description', hotelDescription);
  };

  const onSubmit = async (data) => {
    setServerErrors('');

    let formData = JSON.stringify({
      title: data.title,
      location: data.location,
      imageUrl: data.imageUrl,
      price: data.price,
      description: data.description,
      hotelId: data.hotelId,
    });

    try {
      const response = await axios(
        `https://hotel-booking-webapp.herokuapp.com/admin/edit/${hotelId}`,
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
          Edit Hotel Info
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
                onClick={onClick()}
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
                onClick={onClick()}
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
                onClick={onClick()}
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
                onClick={onClick()}
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
                onClick={onClick()}
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
          <Grid item xs={12}></Grid>
          <TextField
            inputRef={register({ required: true })}
            id='hotelId'
            name='hotelId'
            value={hotelId}
            type='hidden'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            SUBMIT
          </Button>
        </form>
      </div>
    </Container>
  );
}
