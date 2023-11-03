import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk'; // Import redux-thunk
import { Provider } from 'react-redux';
import { userReducer } from './components/redux/userReducer.js';
import App from './App.jsx';
import "./sass/_main.scss";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Add thunk middleware
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
