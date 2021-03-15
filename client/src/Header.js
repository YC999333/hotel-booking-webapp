import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Link from '@material-ui/core/Link';
import MoreIcon from '@material-ui/icons/MoreVert';

import axios from 'axios';
axios.defaults.withCredentials = true;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  abRoot: {
    backgroundColor: 'white',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function Header(props) {
  let location = useLocation();
  const authStatus = location.state || '';
  const userAuthState = authStatus.userAuthState;
  const adminAuthState = authStatus.adminAuthState;

  const [serverErrors, setServerErrors] = useState('');
  const [userAuth, setUserAuth] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
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
      } else {
        setUserAuth(false);
      }

      if (response.data.adminAuth) {
        setAdminAuth(true);
      } else {
        setAdminAuth(false);
      }
    } catch (error) {
      if (error.response) {
        setServerErrors(error.response.data.message);
        alert('Please sign in!');
      } else {
        console.log('Error', error.message);
      }
      console.log(error);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 7200000);
    return () => clearInterval(interval);
  }, [userAuthState, adminAuthState]);

  const classes = useStyles();
  const [anchor1El, setAnchor1El] = React.useState(null);
  const [anchor2El, setAnchor2El] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isLeftMenuOpen = Boolean(anchor1El);
  const isRightMenuOpen = Boolean(anchor2El);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchor2El(event.currentTarget);
  };

  const handleLeftMenuOpen = (event) => {
    setAnchor1El(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchor1El(null);
    setAnchor2El(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const onSubmit = async (data) => {
    let formData = JSON.stringify({
      search: data.search,
    });

    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/search',
        {
          headers: { 'content-type': 'application/json' },
          method: 'POST',
          data: formData,
        }
      );
      let hotel = response.data.hotel;

      if (hotel) {
        navigate('/search-hotel', { state: hotel });
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

  const logout = async () => {
    try {
      const response = await axios(
        'https://hotel-booking-webapp.herokuapp.com/auth/signout',
        {
          headers: { 'content-type': 'application/json' },
          method: 'GET',
        }
      );

      if (response.data) {
        window.location.reload();
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const menuId = 'primary-search-account-menu';

  const renderLeftMenu = (
    <Menu
      anchorEl={anchor1El}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isLeftMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={goHome}>Home</MenuItem>
      <MenuItem onClick={() => navigate('/search-all')}>
        Find All Stays
      </MenuItem>
      {userAuth || userAuthState ? (
        <MenuItem onClick={() => navigate('/orders')}>My Orders</MenuItem>
      ) : null}
    </Menu>
  );

  const renderRightMenu = (
    <Menu
      anchorEl={anchor2El}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isRightMenuOpen}
      onClose={handleMenuClose}
    >
      {adminAuth || adminAuthState ? (
        <MenuItem onClick={() => navigate('/admin')}>Add</MenuItem>
      ) : null}
      {userAuth || adminAuth || userAuthState || adminAuthState ? null : (
        <MenuItem onClick={() => navigate('/signin')}>Sign in</MenuItem>
      )}
      {userAuth || adminAuth || userAuthState || adminAuthState ? (
        <MenuItem onClick={logout}>Sign out</MenuItem>
      ) : null}
      <MenuItem onClick={() => navigate('/signup')}>Sign up</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar
        position='static'
        classes={{
          root: classes.abRoot,
        }}
      >
        <Toolbar style={{ color: '#000000' }}>
          <MenuIcon
            onClick={handleLeftMenuOpen}
            style={{ marginRight: '50px' }}
          />
          {renderLeftMenu}
          <Typography
            className={classes.title}
            variant='h6'
            noWrap
            style={{ color: '#000000' }}
          >
            <Link onClick={goHome} style={{ color: '#000000' }}>
              My Stays
            </Link>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputBase
                type='text'
                name='search'
                placeholder='Enter location...'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputRef={register({ required: true })}
              />
            </form>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderRightMenu}
    </div>
  );
}

export default Header;
