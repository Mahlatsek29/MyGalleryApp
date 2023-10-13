import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';

const Gallery = ({ navigation }) => {
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const galleryFolderName = 'GalleryApp';
      const directory = `${FileSystem.documentDirectory}${galleryFolderName}/`;
      const files = await FileSystem.readDirectoryAsync(directory);
      const imageUris = files.map((file) => `${directory}${file}`);
      setGalleryImages(imageUris);
    } catch (error) {
      console.log('Error fetching gallery images:', error);
    }
  };

  const renderGalleryItem = ({ item }) => (
    <TouchableOpacity style={styles.imageContainer} onPress={() => openImage(item)}>
      <View style={styles.imageCard}>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    </TouchableOpacity>
  );

  const openImage = (imageUri) => {
    console.log('Opening image:', imageUri);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={galleryImages}
        renderItem={renderGalleryItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />

      {/* Back button at the bottom */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#000',
  },
  imageContainer: {
    flex: 1,
    margin: 2,
  },
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 50,
  },
});

export default Gallery;
