import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './assets/styles/reponsive.scss';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import store from './app/store';
import { TrailerContextProvider } from './contexts/trailerContenxt';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <TrailerContextProvider>
        <App />
      </TrailerContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
