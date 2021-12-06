import React from 'react';
import ReactDOM from 'react-dom';
import Root from './frontend/src/components/root';
import configureStore from './frontend/src/store/store';
import jwt_decode from 'jwt-decode';
import { setAuthToken } from './frontend/src/util/session_api_util';
import { logout } from './frontend/src/actions/session_actions';

document.addEventListener('DOMContentLoaded', () => {
  let store;

  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decodedUser = jwt_decode(localStorage.jwtToken);
    const preloadedState = { session: { isAuthenticated: true, user: decodedUser } };

    store = configureStore(preloadedState);

    const currentTime = Date.now() / 1000;

    if (decodedUser.exp < currentTime) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
  } else {
    store = configureStore({});
  }
  const root = document.getElementById('root');

  ReactDOM.render(<Root store={store} />, root);
});