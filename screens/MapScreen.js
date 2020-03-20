import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE  } from 'react-native-maps';

import {connect} from 'react-redux';


const MapScreen = ({userLocation}) => {
    return (
        <View style={styles.container} >
            <MapView 
                provider={PROVIDER_GOOGLE}
                style={styles.mapStyle} 
                initialRegion={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.0082,
                    longitudeDelta: 0.0081,
                  }}>

        <Marker
            coordinate={userLocation.coords}
            title="You are here"
            description="nothinhg"
            />
                  </MapView>
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
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
  });

  const mapStateToProps = (state) =>{
    return {
        userLocation: state.mapReducer
    }
}
export default connect(mapStateToProps)(MapScreen);  