import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

export default function Item(props) {

    const goToLocation = async() => {
      await props.openLocation(props.reference)
    }
    return (
        <TouchableOpacity
        style={styles.btnStyle}
        onPress={goToLocation}>
            <View style={styles.horizonalContainerChild}>
                <View style={styles.imageStyle}>
                
                <Image
                style={styles.internalImageStyle}
                source={require ('../assets/LocationPic.jpg')}
                />
                </View>
                <View>
                <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.movieInfo}>{props.description}</Text>
                </View>
            </View>
        </TouchableOpacity>

    );
  }

  const styles = StyleSheet.create({

    btnStyle: {
        height: 75,
        backgroundColor: '#DDDDDD',
        padding: 8,
        marginVertical:2,
        marginHorizontal: 10,
    },  
      imageStyle:{
        width: 50, height: 55
      },
      horizonalContainerChild:{
          flexDirection: 'row',
      },
      title:{
          marginHorizontal: 10,
          fontSize: 15,
          fontWeight: "bold",
          width : 290
      },
      movieInfo:{
        marginHorizontal: 10,
        width : 290
      }, 
      internalImageStyle :{
        width: undefined, 
        height: undefined,
        flex: 1

      }
  });
  