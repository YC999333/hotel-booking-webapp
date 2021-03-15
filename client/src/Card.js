import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 295,
  },
  media: {
    height: 170,
  },
});

export default function MediaCard({ src, title, description, price }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia className={classes.media} image={src} title={title} />
        <CardContent>
          <Typography gutterBottom variant='h6' component='h6'>
            {description}
          </Typography>
          <Typography variant='h6' color='textSecondary' component='p'>
            {price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
