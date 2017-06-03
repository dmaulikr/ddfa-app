import Promise from 'bluebird';
import Permissions from 'react-native-permissions';

export class LocationAccessUnauthorized extends Error {}

class GeoLocationService {
  promptLocationAccess() {
    return new Promise((resolve, reject) => {
      Permissions.requestPermission('location').then((permission) => {
        permission === 'authorized' ?
          resolve() : reject(new LocationAccessUnauthorized('location access denied'));
      }, reject);
    });
  }

  _calculateRegionDelta(coordinates, distance = 500) {
    const { latitude, longitude } = coordinates;

    distance = distance / 2;
    const circumference = 40075;
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const angularDistance = distance / circumference;

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = Math.abs(Math.atan2(
      Math.sin(angularDistance) * Math.cos(latitude),
      Math.cos(angularDistance) - Math.sin(latitude) * Math.sin(latitude)));
    return { latitude, longitude, latitudeDelta, longitudeDelta }
  }

  getCurrentLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    };
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(this._calculateRegionDelta(position.coords));
      }, reject, options);
    });
  }
}

export default new GeoLocationService();