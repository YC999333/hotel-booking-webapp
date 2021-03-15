import './App.css';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchNearBy from './SearchNearBy.js';
import Search from './Search.js';
import SignInForm from './auth/SignInForm';
import SignUpForm from './auth/SignUpForm';
import Admin from './admin/Admin';
import React from 'react';
import Edit from './admin/Edit';
import SearchAll from './SearchAll';
import Orders from './Orders';

function App() {
  return (
    <div className='App'>
      <Router>
        <Header />

        <Routes>
          <Route path='/search-hotel' element={<Search />}></Route>
          <Route path='/search-nearby'>
            <SearchNearBy />
          </Route>
          <Route path='/search-all' element={<SearchAll />}></Route>

          <Route path='/admin/edit/:hotelId'>
            <Edit />
          </Route>

          <Route path='/admin'>
            <Admin />
          </Route>

          <Route path='/signin'>
            <SignInForm />
          </Route>

          <Route path='/signup'>
            <SignUpForm />
          </Route>

          <Route path='/orders'>
            <Orders />
          </Route>

          <Route path='/'>
            <Home />
          </Route>
        </Routes>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
