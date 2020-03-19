import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import {logout} from '../redux/actions'

import * as firebase from 'firebase'
import {connect} from 'react-redux';


const SettingsScreen = ({logout}) => {

  const logoutUser = () => {
    firebase.auth().signOut()
    logout()
  }

  return (
    <View style={styles.container} >
        <Text style={{fontSize:30}}>Settings Screen</Text>
        <Button title="Log-Out" onPress={logoutUser} />
    </View>
  )
} 


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  export default connect(null, {logout})(SettingsScreen);  