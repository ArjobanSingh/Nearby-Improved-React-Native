import React from 'react'
import { StyleSheet, Text, View, Button, Dimensions, TouchableHighlight, ScrollView  } from 'react-native';


import {connect} from 'react-redux';

const { width } = Dimensions.get('window')


const MainLayout = ({someData, pressStatus, text, isMounted, openMapScreen, setPressStatus}) => {

    const onHideUnderlay = () => {
        if (isMounted) setPressStatus(false)
    }

    const onShowUnderlay = () => {
        if (isMounted) setPressStatus(true)
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

export default MainLayout // connect(null)(SettingsScreen);  