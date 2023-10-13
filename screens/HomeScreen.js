import React from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, Text } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const navigateToCamera = () => {
    navigation.navigate('Camera');
  };

  const navigateToGallery = () => {
    navigation.navigate('Gallery');
  };

  return (
    <ImageBackground
      source={require('../assets/image.jpg')} 
      style={styles.container}
    >
      <TouchableOpacity style={styles.button} onPress={navigateToCamera}>
        <Text style={styles.buttonText}>Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToGallery}>
        <Text style={styles.buttonText}>Gallery</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomeScreen;
