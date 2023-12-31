import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as LocationGeocoding from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

export default function CameraScreen({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Request media library permissions
      await MediaLibrary.requestPermissionsAsync();

      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');

      // Fetch location and address
      fetchLocationAndAddress();
    })();
  }, []);

  const fetchLocationAndAddress = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Reverse geocode to get address
      const addressData = await LocationGeocoding.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressData.length > 0) {
        const { city, street, name } = addressData[0];
        const formattedAddress = `${name || street}, ${city}`;
        setAddress(formattedAddress);
      } else {
        setAddress('Address not available');
      }
    } catch (error) {
      console.log('Error getting location and address:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        // Take a picture with the camera
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
        fetchLocationAndAddress();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const savePicture = async () => {
    if (image) {
      try {
        // Define gallery folder name and directory
        const galleryFolderName = 'GalleryApp';
        const directory = `${FileSystem.documentDirectory}${galleryFolderName}/`;

        // Ensure the gallery directory exists
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

        // Generate a unique filename
        const fileName = `image_${Date.now()}.jpg`;

        // Specify the source and destination paths
        const sourcePath = image;
        const destinationPath = `${directory}${fileName}`;

        // Move the image to the gallery directory
        await FileSystem.moveAsync({
          from: sourcePath,
          to: destinationPath,
        });

        console.log('Image saved successfully at:', destinationPath);
      } catch (error) {
        console.log('Error saving image:', error);
      }
    }
  };

  const toggleGallery = () => {
    navigation.navigate('Gallery');
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Custom header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Camera</Text>
        <View style={{ width: 24 }} />
      </View>

      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          flashMode={flash}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
            }}
          >
            <Button
              title=""
              icon="retweet"
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            />
            <Button
              onPress={() =>
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                )
              }
              icon="flash"
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
            />
          </View>
        </Camera>
      ) : (
        <>
          <Image source={{ uri: image }} style={styles.camera} />
          <View style={styles.locationContainer}>
            {location && (
              <>
                <Text style={styles.locationText}>
                  Latitude: {location.coords.latitude}
                </Text>
                <Text style={styles.locationText}>
                  Longitude: {location.coords.longitude}
                </Text>
                <Text style={styles.locationText}>Address: {address}</Text>
              </>
            )}
          </View>
        </>
      )}

      <View style={styles.controls}>
        {image ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}
          >
            <Button
              title="Re-take"
              onPress={() => setImage(null)}
              icon="retweet"
            />
            <Button title="Save" onPress={savePicture} icon="check" />
          </View>
        ) : (
          <Button title="Take a picture" onPress={takePicture} icon="camera" />
        )}

        {!image && (
          <Button title="Gallery" onPress={toggleGallery} icon="image" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#000',
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16, 
    backgroundColor: '#333', 
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8, 
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  locationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  controls: {
    flex: 0.5,
  },
});

