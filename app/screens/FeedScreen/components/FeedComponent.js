import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { Alert } from 'react-native';
import {
  View,
  Text,
  Button,
  Divider,
} from '@shoutem/ui';
import ActionButton from 'react-native-action-button';
import navigationOptions from '../NavigationOptions';

import AuthenticationService from '../../../services/AuthenticationService';

export default class FeedScreen extends Component {
  static navigationOptions = navigationOptions;

  constructor(props) {
    super(props);

    /* Internal */

    this.navigateToLogin = this.navigateToLogin.bind(this);

    /* External */

    this.onActionButtonPress = this.onActionButtonPress.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  navigateToLogin() {
    AuthenticationService.logout().then(() => {
      this.props.navigation.dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Login' }),
        ],
      }));
    }, console.warn);
  }

  onActionButtonPress() {
    this.props.navigation.navigate('CheckIn');
  }

  onLogout() {
    const buttons = [
      { text: 'Yes', onPress: this.navigateToLogin },
      { text: 'Cancel', style: 'cancel' },
    ];
    Alert.alert('Exit DDFA', 'Are you sure you want to log out?', buttons);
  }

  render() {
    return (
      <View styleName="fill-parent">
        <View styleName="fill-parent horizontal h-center vertical v-center">
          <Text>Activities Feed coming soon!</Text>
          <Divider style={{ paddingTop: 10 }} />
          <Button styleName="secondary" onPress={this.onLogout}>
            <Text>LOGOUT</Text>
          </Button>
        </View>
        <ActionButton onPress={this.onActionButtonPress} />
      </View>
    );
  }
}
