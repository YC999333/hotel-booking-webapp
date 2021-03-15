import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Search.css';
import { Button } from '@material-ui/core';
import SearchResult from './SearchResult';
import axios from 'axios';
axios.defaults.withCredentials = true;

function Search(props) {
  let location = useLocation();
  const hotels = location.state;

  return (
    <div className='searchPage'>
      <div className='searchPage__info'>
        <p>62 stays · 26 august to 30 august · 2 guest</p>
        <Button variant='outlined'>Cancellation Flexibility</Button>
        <Button variant='outlined'>Type of place</Button>
        <Button variant='outlined'>Price</Button>
        <Button variant='outlined'>Rooms and beds</Button>
        <Button variant='outlined'>More filters</Button>
      </div>

      {hotels.map((hotel) => {
        return <SearchResult hotel={hotel} />;
      })}
    </div>
  );
}

export default Search;
