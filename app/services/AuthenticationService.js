import request from './HttpRequestService';
import Promise from 'bluebird';

import { AsyncStorage } from 'react-native';

class AuthenticationService {
  initialize(host) {
    this.host = host;
  }

  get token() {
    return new Promise((resolve, reject) => {
      return AsyncStorage.getItem('@user.token').then(resolve, reject);
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      return AsyncStorage.clear().then(resolve, reject);
    });
  }

  login(username, password) {
    const endpoint = `${this.host}/users/authenticate`;
    const payload = { username, password };

    return new Promise((resolve, reject) => {
      request.post(endpoint, payload).then((res) => {
        return AsyncStorage.setItem('@user.token', res.body.token);
      }).then(() => resolve(), reject);
    });
  }
}

export default new AuthenticationService();
