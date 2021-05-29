import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import Routes from './componentes/routes';
import { initDB } from 'react-indexed-db';
import { DBconfig } from './DBconfig';
import * as serviceWorker from './serviceWorker';

initDB(DBconfig);
ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes/>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
/* reportWebVitals(); */
serviceWorker.register();
