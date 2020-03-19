import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {connect} from 'react-redux'
import {handleLogin} from '../redux/actions'



const LoginScreen = ({loginUser}) => {

    return (
        <View style={styles.container} >
            <Text style={{fontSize:30}}>Login!</Text>
            <Button title="Sign in with Google" onPress={() => loginUser()} />
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


  export default connect(null, {loginUser: handleLogin})(LoginScreen);  