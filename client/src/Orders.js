import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

function Orders() {
  const [serverErrors, setServerErrors] = useState('');
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  const getOrder = async () => {
    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/get-orders',
        {
          headers: { 'content-type': 'application/json' },
          method: 'GET',
        }
      );

      const { userOrders } = response.data;

      setOrders(userOrders);
      setUser(userOrders[0].user);
    } catch (error) {
      if (error.response) {
        setServerErrors(error.response.data.message);
      } else {
        console.log('Error', error.message);
      }
      console.log(error);
    }
  };

  React.useEffect(() => {
    getOrder();
  }, []);

  const onDelete = async (id) => {
    console.log(id);
    try {
      const response = await axios(
        `https://hotel-booking-webapp.herokuapp.com/orders/delete/${id}`,
        {
          headers: { 'content-type': 'application/json' },
          method: 'DELETE',
        }
      );

      if (response.status === 200) {
        window.location.reload();
        navigate('/orders');
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else {
        console.log('Error', error.message);
      }
      console.log(error);
    }
  };

  return (
    <div className='searchPage'>
      <div className='searchPage__info'>
        {serverErrors ? <h1>{serverErrors}</h1> : null}
        {serverErrors ? null : <h1>Thank you {user} for booking!</h1>}
        <ul>
          {orders.map((order) => {
            return order.reservations.map((reservation) => {
              return [
                <li>
                  <h3>Order # : {reservation._id}</h3>
                </li>,
                <li>
                  <h3>Hotel: {reservation.title}</h3>
                </li>,
                <li>
                  <h3>
                    Stay from {''}
                    {DateTime.fromISO(
                      reservation.start
                    ).toLocaleString()} to{' '}
                    {DateTime.fromISO(reservation.end).toLocaleString()}
                  </h3>
                </li>,
                <li>
                  <h3>Nights: {reservation.nights}</h3>
                </li>,
                <li>
                  <h3>Price: {reservation.price}</h3>
                </li>,
                <li>
                  <h3>Total: ${reservation.total}</h3>
                </li>,
                <Button
                  style={{ marginLeft: '10px' }}
                  onClick={() => onDelete(reservation._id)}
                  size='small'
                  variant='outlined'
                  style={{ display: 'flex', marginTop: '10px' }}
                >
                  Delete
                </Button>,
                <br></br>,
                <br></br>,
              ];
            });
          })}
        </ul>
      </div>
    </div>
  );
}

export default Orders;
