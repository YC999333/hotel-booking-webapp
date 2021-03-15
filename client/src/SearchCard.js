import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import SearchDate from './SearchDate';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';
axios.defaults.withCredentials = true;

const useStyles = makeStyles({
  root: {
    maxWidth: 350,
  },
  media: {
    height: 170,
  },
});

export default function SearchCard({ hotel, adminAuth }) {
  const { imageUrl, title, price, location, description } = hotel;
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();

  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  const upperLocation = location.capitalize();

  const onClick = () => {
    navigate(`/admin/edit/${hotel._id}`);
  };

  const onDelete = async () => {
    try {
      await axios(
        `https://hotel-booking-webapp.herokuapp.com/admin/delete/${hotel._id}`,
        {
          headers: { 'content-type': 'application/json' },
          method: 'DELETE',
        }
      );
      navigate('/', { replace: true });
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
    <Card className={classes.root}>
      <CardActionArea component='span'>
        <CardMedia className={classes.media} image={imageUrl} title={title} />
        <CardContent>
          <Typography
            color='textSecondary'
            gutterBottom
            variant='subtitle1'
            component='p'
          >
            {upperLocation}
          </Typography>
          <Typography gutterBottom variant='h6' component='h6'>
            {title}
          </Typography>
          <Typography gutterBottom variant='subtitle1' component='p'>
            {description}
          </Typography>
          <Typography variant='h6' color='textSecondary' component='p'>
            ${price}
          </Typography>
          {showSearch && <SearchDate hotelId={hotel._id} />}
          <Button
            onClick={() => setShowSearch(!showSearch)}
            variant='outlined'
            size='small'
          >
            {showSearch ? 'Hide' : 'Search Dates'}
          </Button>
          {adminAuth ? (
            <Button
              style={{ marginLeft: '10px' }}
              onClick={onClick}
              size='small'
              variant='outlined'
            >
              Edit
            </Button>
          ) : null}
          {adminAuth ? (
            <Button
              style={{ marginLeft: '10px' }}
              onClick={onDelete}
              size='small'
              variant='outlined'
            >
              Delete
            </Button>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
