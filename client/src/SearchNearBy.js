import React, { useState, useEffect } from 'react';
import './SearchNearBy.css';
import { Button } from '@material-ui/core';
import SearchResult from './SearchResult';
import axios from 'axios';
axios.defaults.withCredentials = true;

function SearchNearBy() {
  const [serverErrors, setServerErrors] = useState('');
  const [hotels, setHotels] = useState([]);

  const searchNear = async () => {
    let formData = JSON.stringify({ location: 'taiwan' });
    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/search/nearby',
        {
          headers: { 'content-type': 'application/json' },
          data: formData,
          method: 'POST',
        }
      );

      setHotels(response.data.hotel);
    } catch (error) {
      if (error.response) {
        setServerErrors(error.response.data.message);
        console.log(serverErrors);
      } else {
        console.log('Error', error.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    searchNear();
  }, []);

  return (
    <div className='searchPage'>
      <div className='searchPage__info'>
        <p>62 stays · 26 august to 30 august · 2 guest</p>
        <h1>Stays nearby</h1>
        <Button variant='outlined'>Cancellation Flexibility</Button>
        <Button variant='outlined'>Type of place</Button>
        <Button variant='outlined'>Price</Button>
        <Button variant='outlined'>Rooms and beds</Button>
        <Button variant='outlined'>More filters</Button>
      </div>
      {hotels.map((hotel) => {
        return <SearchResult key={hotel._id} hotel={hotel} />;
      })}
    </div>
  );
}

export default SearchNearBy;
