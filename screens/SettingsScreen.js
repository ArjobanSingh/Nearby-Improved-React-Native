import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';



const SettingsScreen = () => {



  const dummyFunc = () => {
    alert("App Developed By Arjoban Singh")
  }

  return (
    <View style={styles.container} >
        <Text style={{fontSize:30}}>Settings Screen</Text>
        <Button title="Click Me!" onPress={dummyFunc} />
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