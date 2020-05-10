import React from 'react';
import { StyleSheet, Text, View, Button, Linking } from 'react-native';



const SettingsScreen = () => {



  const conatctMe = () => {
    Linking.openURL('https://github.com/ArjobanSingh')
    
  }

  return (
    <View style={styles.container} >
        <Text style={{fontSize:22, marginBottom:10}}>App Developed by Arjoban Singh</Text>
        <Button title="Contact Me!" onPress={conatctMe} />
        <Text style={{fontSize:20, position: 'absolute', bottom:"2%"}}>Screen to add settings in future</Text>
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

  export default SettingsScreen