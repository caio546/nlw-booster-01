import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import EditPoint from './pages/EditPoint';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PointsListing from './pages/PointsListing';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoint} path="/create-point" />
      <Route component={EditPoint} path="/edit-point" />
      <Route component={Login} path="/login" />
      <Route component={SignUp} path="/signup" />
      <Route component={PointsListing} path="/points" />
    </BrowserRouter>
  );
}

export default Routes;