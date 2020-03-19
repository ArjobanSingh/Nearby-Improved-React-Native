import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Dimensions } from 'react-native';

const { width } = Dimensions.get('window')

const HomeScreen = ({navigation }) => {
    const [pressStatus, setPressStatus] = useState(false)

    const onHideUnderlay = () => {
        setPressStatus(false)
    }

    const onShowUnderlay = () => {
        setPressStatus(true)
    }

    const openMapScreen = () =>{
        navigation .navigate('Map')
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
        </View>
    )
} 


const styles = StyleSheet.create({
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

  export default HomeScreen;  