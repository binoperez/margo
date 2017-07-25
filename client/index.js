import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/App.jsx'
import {Provider} from 'react-redux'
import store from "./store";
import { createStore } from 'redux'
require ('./styles/app.scss')


ReactDOM.render(
    <Provider store={store}>
         <App/>
    </Provider>, 
    window.document.getElementById('root')
);