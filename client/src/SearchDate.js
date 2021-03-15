import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import './SearchDate.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateTime } from 'luxon';
import axios from 'axios';
axios.defaults.withCredentials = true;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

function SearchDate(hotelId) {
  const [serverErrors, setServerErrors] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bookMSG, setBookMSG] = useState('');
  const [userAuth, setUserAuth] = useState(false);
  const [user, setUser] = useState('');
  const _id = hotelId.hotelId;

  const checkAuth = async () => {
    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/auth/check-user',
        {
          headers: { 'content-type': 'application/json' },
          method: 'GET',
        }
      );

      if (response.data.userAuth) {
        setUserAuth(true);
        setUser(response.data.user.username);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setServerErrors(error.response.data.message);
        setUserAuth(false);
      } else {
        console.log('Error', error.message);
      }
      console.log(error);
    }
  };

  React.useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 7200000);
    return () => clearInterval(interval);
  }, []);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (dates) => {
    let [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let searchStart = startDate;

    let searchEnd = endDate;

    let date = JSON.stringify({
      start: searchStart,
      end: searchEnd,
      hotelId: _id,
      username: user,
    });

    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/book',
        {
          headers: { 'content-type': 'application/json' },
          method: 'POST',
          data: date,
        }
      );

      let start = response.data.date.start;
      let end = response.data.date.end;

      let convertedStart = DateTime.fromISO(start).toLocaleString();
      let convertedEnd = DateTime.fromISO(end).toLocaleString();

      if (response.status === 200) {
        setServerErrors('');
        setBookMSG(
          `Thank you ${user}! ${response.data.message} for stay from ${convertedStart} to ${convertedEnd}`
        );
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
    <div className='search'>
      <form onSubmit={onSubmit}>
        <DatePicker
          dateFormat='dd/MM/yyyy'
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          selectsRange
          inline
        />
        {userAuth ? (
          <Button
            type='submit'
            variant='contained'
            color='primary'
            onClick={handleClickOpen}
          >
            Book
          </Button>
        ) : (
          <h2 className='date_signin'>Please sign in to book</h2>
        )}
      </form>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle id='alert-dialog-slide-title'>{''}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            {serverErrors ? serverErrors : bookMSG}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SearchDate;
