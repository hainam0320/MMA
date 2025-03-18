import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function ImageMapApp() {
  const [image, setImage] = useState(null);
  const [note, setNote] = useState('');
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);

 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Bạn cần cấp quyền truy cập vị trí để sử dụng tính năng này!');
        return;
      }

      let isGPSEnabled = await Location.hasServicesEnabledAsync();
      if (!isGPSEnabled) {
        alert("GPS chưa được bật. Vui lòng bật GPS để sử dụng tính năng này.");
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      if (locationResult?.coords) {
        const newRegion = {
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation(newRegion);
        setMapRegion(newRegion);
      }
    })();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      alert('Bạn cần cấp quyền camera để chụp ảnh!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });

    if (!result.canceled) {
      let locationResult = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      };

      setImage(result.assets[0].uri);
      setLocation(newLocation);
    }
  };
 const toggleMapView = () => {
    setIsMapCollapsed(!isMapCollapsed);
  };
  
  const deleteImage = async (imageToDelete) => {
    const updatedList = imageList.filter(item => item.uri !== imageToDelete.uri);
    setImageList(updatedList);
    await AsyncStorage.setItem('imageList', JSON.stringify(updatedList));
    setModalVisible(false);
  };
  const pickImageFromLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      alert('Bạn cần cấp quyền truy cập thư viện ảnh!');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      let locationResult = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      };
  
      setImage(result.assets[0].uri);
      setLocation(newLocation);
    }
  };
  const saveImageWithNote = async () => {
    if (image && location) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

      const newEntry = {
        uri: image,
        note: note.trim() !== '' ? note : `Chụp ngày: ${formattedDate}`,
        date: formattedDate,
        location,
      };

      const updatedList = [...imageList, newEntry];
      setImageList(updatedList);
      await AsyncStorage.setItem('imageList', JSON.stringify(updatedList));

      setImage(null);
      setNote('');
      setLocation(null);
    } else {
      alert('Không có ảnh hoặc không lấy được vị trí!');
    }
  };

  useEffect(() => {
    const loadImageList = async () => {
      const storedList = await AsyncStorage.getItem('imageList');
      if (storedList) {
        setImageList(JSON.parse(storedList));
      }
    };
    loadImageList();
  }, []);

  const openImageDetail = (item) => {
    setSelectedImage(item);
    Image.getSize(item.uri, (width, height) => {
      setImageSize({ width, height });
    });
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>

      {isMapCollapsed ? (
  <TouchableOpacity style={styles.mapCollapsed} onPress={toggleMapView}>
    <Text style={styles.mapIcon}>💞</Text>
  </TouchableOpacity>
) : (
  <View style={styles.mapContainer}>
    <MapView style={styles.map} region={mapRegion}>
      {imageList.map((item, index) => (
        <Marker
          key={index}
          coordinate={item.location}
          title={item.note}
          description={`Chụp: ${item.date}`}
          onPress={() => openImageDetail(item)}
        >
          <Image source={{ uri: item.uri }} style={styles.markerImage} />
        </Marker>
      ))}
    </MapView>
    <TouchableOpacity style={styles.collapseButton} onPress={toggleMapView}>
      <Text style={styles.collapseText}>⬇ Thu nhỏ</Text>
    </TouchableOpacity>
  </View>
)}

        <Button title="📸 Chụp ảnh mới" onPress={pickImage} />
        <Button title="📂 Chọn ảnh từ máy" onPress={pickImageFromLibrary} />

        {image && (
          <View style={styles.inputContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TextInput style={styles.textInput} placeholder="Ghi chú" value={note} onChangeText={setNote} />
            <Button title="📁 Lưu ảnh" onPress={saveImageWithNote} />
          </View>
        )}

        <FlatList
          ListHeaderComponent={() => (
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.galleryTitle}>📷Ảnh</Text>
              <Text style={styles.imageCount}>{`${imageList.length} mục`}</Text>
            </View>
          )}
          data={imageList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openImageDetail(item)}>
              <View style={styles.listItem}>
                <Image source={{ uri: item.uri }} style={styles.listImage} />
                <Text style={styles.listNote}>{item.note}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {selectedImage && (
          <Modal visible={modalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.modalImage} />
              <Text style={styles.modalNote}>{selectedImage.note}</Text>
              <Text style={styles.modalLocation}>
                🗺 {selectedImage.location.latitude.toFixed(5)}, {selectedImage.location.longitude.toFixed(5)}
              </Text>
              <Text style={styles.modalDate}>⏱ {selectedImage.date}</Text>
              <Text style={styles.modalSize}>🖼 {imageSize.width} x {imageSize.height} px</Text>
              <View style={styles.buttonContainer}>
                <Button title="🗑 Xóa ảnh" color="red" onPress={() => deleteImage(selectedImage)} />
                <Button title="Đóng" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { flex: 1, padding: 16, paddingTop: 40, backgroundColor: '##FFFFCC' },

  map: { 
    width: '100%', 
    height: 300, 
    borderRadius: 15, 
    overflow: 'hidden', 
    marginBottom: 16 
  },

  markerImage: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },

  inputContainer: { 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 5,
    marginBottom: 16 
  },

  imagePreview: { 
    width: 250, 
    height: 250, 
    borderRadius: 10, 
    marginBottom: 10 
  },

  textInput: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    width: '100%', 
    borderRadius: 8, 
    backgroundColor: '#fff', 
    marginBottom: 10 
  },

  button: { 
    backgroundColor: '#007AFF', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginVertical: 5 
  },

  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  galleryTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 8, 
    color: '#333' 
  },

  imageCount: { 
    fontSize: 16, 
    color: '#555', 
    textAlign: 'center', 
    marginBottom: 16 
  },

  listContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  listItem: { 
    width: 'auto', 
    height: 'auto',
    marginBottom: 12, 
    borderRadius: 10, 
    backgroundColor: '#fff', 
    padding: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 4 
  },

  listImage: { 
    width: '100%', 
    height: 120, 
    borderRadius: 8, 
    marginBottom: 6 
  },

  listNote: { textAlign: 'center', fontSize: 14, color: '#333' },

  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    padding: 20 
  },

  modalImage: { width: 320, height: 320, borderRadius: 12, marginBottom: 20 },

  modalNote: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },

  modalLocation: { color: '#ddd', fontSize: 14, marginBottom: 5 },

  modalDate: { color: '#ddd', fontSize: 14, marginBottom: 5 },

  modalSize: { color: '#ddd', fontSize: 14, marginBottom: 10 },

  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  collapseButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 5,
  },

  collapseText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  mapCollapsed: {
    alignSelf: 'left',
    backgroundColor: '#FFCCCC',
    padding: 12,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapIcon: {
    fontSize: 24,
    color: '#fff',
  },
});
