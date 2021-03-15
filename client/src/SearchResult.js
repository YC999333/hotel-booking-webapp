import React, { useState, useEffect } from 'react';
import './SearchResult.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SearchCard from './SearchCard';
import axios from 'axios';
axios.defaults.withCredentials = true;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
    margin: 'auto',
    maxWidth: 750,
  },
  image: {
    width: 350,
    height: 200,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

function SearchResult({ hotel }) {
  const [serverErrors, setServerErrors] = useState('');
  const [adminAuth, setAdminAuth] = useState(false);
  const classes = useStyles();

  const checkAuth = async () => {
    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/auth/check-user',
        {
          headers: { 'content-type': 'application/json' },
          method: 'GET',
        }
      );

      if (response.data.adminAuth) {
        setAdminAuth(true);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setServerErrors(error.response.data.message);
        setAdminAuth(false);
      } else {
        console.log('Error', error.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 7200000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <SearchCard hotel={hotel} adminAuth={adminAuth} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default SearchResult;
