import React, { Component } from 'react';
import _ from 'lodash';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  View,
  ListView,
  Spinner,
  Row
} from '@shoutem/ui';
import {
  Text,
  Subtitle,
  Caption
} from '@shoutem/ui';
import { Icon as UIIcon } from '@shoutem/ui';

import { View as RNView } from 'react-native';

import MapView from 'react-native-maps';
import GeoLocationService from '../../services/GeoLocationService';
import GoogleMapsService from '../../services/GoogleMapsService';

const CURRENT_POSITION_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};

const PLACES_SEARCH_RADIUS = 200;

export default class CheckInScreen extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: () => {
      return <Caption styleName="h-center">Check-in</Caption>;
    },
    tabBarIcon: () => (
      <Icon name="ios-pin" size={24} />
    )
  };

  constructor(props) {
    super(props);

    this.state = {
      currentPosition: null,
      currentPositionStatus: CURRENT_POSITION_STATUS.PENDING,
      places: [],
    };

    this.shouldShowSpinner = this.shouldShowSpinner.bind(this);
    this.setCurrentLocation = this.setCurrentLocation.bind(this);
    this.renderPlacesRow = this.renderPlacesRow.bind(this);
    this.renderPlacesList = this.renderPlacesList.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.renderMapMarkers = this.renderMapMarkers.bind(this);
  }

  componentDidMount() {
    this.setCurrentLocation();
  }

  setCurrentLocation() {
    this.setState({ currentPositionStatus: CURRENT_POSITION_STATUS.IN_PROGRESS });

    return GeoLocationService.promptLocationAccess().then(() => {
      return GeoLocationService.getCurrentLocation();
    }).then((position) => {
      this.setState({
        currentPosition: position,
        currentPositionStatus: CURRENT_POSITION_STATUS.SUCCESS,
      });
      return GoogleMapsService.getNearby(
        position.latitude, position.longitude, PLACES_SEARCH_RADIUS
      );
    }).then((places) => {
      this.setState({ places });
    }, () => {
      this.setState({
        currentPositionStatus: CURRENT_POSITION_STATUS.ERROR,
      });
    });
  }

  shouldShowSpinner() {
    return _.includes([
      CURRENT_POSITION_STATUS.IN_PROGRESS,
      CURRENT_POSITION_STATUS.PENDING
    ], this.state.currentPositionStatus);
  }

  renderPlacesRow(place) {
    return (
      <Row styleName="small" style={styles.placesListRow}>
        <UIIcon name="pin" />
        <View styleName="vertical">
          <Subtitle styleName="bold">{place.name}</Subtitle>
          <Caption numberOfLines={1}>{place.address}</Caption>
        </View>
        <UIIcon styleName="disclosure" name="right-arrow"/>
      </Row>
    );
  }

  renderMapMarkers() {
    return _.map(this.state.places, (place, index) => {
      return (
        <MapView.Marker
          title={place.name}
          description={place.address}
          pinColor="blue"
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          key={index}
        />
      );
    });
  }

  renderMap() {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.currentPosition;
    return (
      <MapView
        style={styles.map}
        initialRegion={{ latitude, longitude, latitudeDelta, longitudeDelta }}
      >
        {this.renderMapMarkers()}
        <MapView.Marker coordinate={{ latitude, longitude }} />
      </MapView>
    );
  }

  renderPlacesList() {
    const { places } = this.state;
    if (!places || !places.length) {
      return <Text>{`No places within ${PLACES_SEARCH_RADIUS} metres nearby...`}</Text>;
    }
    return <ListView data={this.state.places} renderRow={this.renderPlacesRow} />;
  }

  render() {
    if (this.shouldShowSpinner()) {
      return (
        <View styleName="fill-parent vertical v-center">
          <Spinner style={styles.spinner} />
        </View>
      );
    }
    if (this.state.currentPositionStatus === CURRENT_POSITION_STATUS.ERROR) {
      return (
        <View styleName="fill-parent vertical v-center">
          <Text>Allow location services to enable check-in feature.</Text>
        </View>
      );
    }
    return (
      <RNView style={styles.container}>
        {this.renderMap()}
        <View style={styles.placesContainer}>
          {this.renderPlacesList()}
        </View>
      </RNView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  map: {
    flex: 0.7,
  },
  placesContainer: {
    flex: 0.3,
  },
  placesListRow: {
    height: 50,
  },
  spinner: {
    size: 'large',
  },
};
