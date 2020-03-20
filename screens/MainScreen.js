import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Dimensions, Platform, AppState, Button } from 'react-native';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import {connect} from 'react-redux';
import {addLocation, removeLocation} from '../redux/actions'

const { width } = Dimensions.get('window')


const HomeScreen = ({navigation, addLocation, removeLocation, userLocation }) => {
    const [errorMessage, setErrorMessage] = useState(null) 
    const [appState, setAppState] = useState(AppState.currentState) 
    const [pressStatus, setPressStatus] = useState(false)

    let isMounted;


    useEffect(() => {
        isMounted = true;
        AppState.addEventListener('change', handleAppStateChange)
        if (Platform.OS === 'android' && !Constants.isDevice) {
            {isMounted ? setErrorMessage(
              'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            ): undefined}
          } else {
            _getLocationAsync();
          }
        console.log("didmount")  


        return (() => {
            isMounted = false;
            AppState.removeEventListener('change', handleAppStateChange)
            removeLocation()
        })
    }, [])

    const handleAppStateChange = (nextAppState) => {
        if (
            appState.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            console.log('App has come to the foreground!');
            getLocationAsync();
          }
          {isMounted ? setAppState(nextAppState) : undefined};
        }

    const _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          {isMounted ?setErrorMessage(
            'Permission to access location was denied',
          ): undefined}
          return
        }
    
        let thisLocation = await Location.getCurrentPositionAsync({});
        {isMounted? addLocation(thisLocation) : undefined}
      };

    const onHideUnderlay = () => {
        if (isMounted) setPressStatus(false)
    }

    const onShowUnderlay = () => {
        if (isMounted) setPressStatus(true)
    }

    const openMapScreen = () =>{
        navigation .navigate('Map')
    }

    const someData = async() => {
        if (await Location.hasServicesEnabledAsync()){
            console.log("Enabled")
            return
        }
        else {
            console.log("Enable Location")
        }
    }

    let text = 'Waiting..';
    if (errorMessage) {
      text = errorMessage;
    } else if (userLocation) {
      text = JSON.stringify(userLocation);
    }

    return (
        <View style={styles.container} >
            <TouchableHighlight 
            style={!pressStatus ? styles.mapButton : styles.pressButton} 
            onPress={openMapScreen}
            onHideUnderlay={onHideUnderlay}
            onShowUnderlay={onShowUnderlay}
            >
                <Text style={{fontSize: 20, fontWeight: 'bold', color:'white'}}>Go To MapScreen</Text>
            </TouchableHighlight>
               <Text style={styles.paragraph}>{text}</Text>
            <Button title="Press to check" onPress={someData} />
        </View>
    )
} 


const styles = StyleSheet.create({
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: 'center',
      },
      container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
      },
      mapButton : {
          height: "5%",
          width: width - 20,
          backgroundColor: 'blue',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginVertical: '2%',
          borderRadius: 50,
          paddingTop: 10,
          elevation: 7,
      },
      pressButton:{
          height: "5%",
          width: width - 50,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginVertical: '2%',
          borderRadius: 50,
          paddingTop: 10,
          elevation: 10,
      }
  });

  const mapStateToProps = (state) =>{
      return {
          userLocation: state.mapReducer
      }
  }
  export default connect(mapStateToProps, {removeLocation, addLocation})(HomeScreen);  