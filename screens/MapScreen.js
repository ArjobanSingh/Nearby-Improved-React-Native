import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE  } from 'react-native-maps';

import {connect} from 'react-redux';


const MapScreen = ({userLocation, route}) => {
    const pinColor = 'yellow';

    useEffect(() => console.log(userLocation.coords, destinationGeometry.location))
    const {destinationGeometry, destinationName, destinationVicinity, destinationPhotos} = route.params

    const destination = () => {
        return {
            "accuracy": 16,
            "altitude": 0,
            "heading": 0,
            "latitude": destinationGeometry.location.lat,
            "longitude": destinationGeometry.location.lng,
            "speed": 0,
        }
    }
    return (
        <View style={styles.container} >
            <MapView 
                provider={PROVIDER_GOOGLE}
                style={styles.mapStyle} 
                initialRegion={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.0382,
                    longitudeDelta: 0.0381,
                  }}>


        <Marker
            coordinate={userLocation.coords}
            title="You are here"
            description="nothinhg"
            />
        <Marker
            coordinate={destination()}
            title={destinationName}
            description={destinationVicinity}
            pinColor={pinColor}
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