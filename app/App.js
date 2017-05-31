import React, { Component } from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';

import Config from './Config';
import AuthenticationService from './services/AuthenticationService';

import ConfigureStore from './store/ConfigureStore';

import {
  NavigationReducer
} from './reducers/NavigationReducer';

import AppNavigator from './navigator/AppNavigator';

export default class App extends Component {
  constructor(props) {
    super(props);

    // Temporary until I add a log-out button...
    // const AsyncStorage = require('react-native').AsyncStorage;
    // AsyncStorage.clear();

    this.store = ConfigureStore(combineReducers({
      navigation: NavigationReducer,
    }), {});

    AuthenticationService.initialize(Config.HOST);
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppNavigator />
      </Provider>
    );
  }
}
