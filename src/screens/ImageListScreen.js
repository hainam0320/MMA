import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ImageListScreen() {
  const [image, setImage] = useState(null);
  const [note, setNote] = useState('');
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadImageList = async () => {
      const storedList = await AsyncStorage.getItem('imageList');
      if (storedList) {
        setImageList(JSON.parse(storedList));
      }
    };
    loadImageList();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      alert('Bạn cần cấp quyền truy cập camera để sử dụng tính năng này!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveImageWithNote = async () => {
    if (image) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
      const finalNote = note.trim() !== '' ? note : `Chụp ngày: ${formattedDate}`;

      const newEntry = { uri: image, note: finalNote };
      const updatedList = [...imageList, newEntry];
      setImageList(updatedList);
      await AsyncStorage.setItem('imageList', JSON.stringify(updatedList));

      setImage(null);
      setNote('');
    }
  };

  const openImageDetail = (item) => {
    setSelectedImage(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Button title="Chụp ảnh mới" onPress={pickImage} />
        {image && (
          <View style={styles.inputContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TextInput
              style={styles.textInput}
              placeholder="Ghi chú hoặc để trống để lưu thời gian chụp"
              value={note}
              onChangeText={setNote}
            />
            <Button title="Lưu ảnh" onPress={saveImageWithNote} />
          </View>
        )}

        <FlatList
          ListHeaderComponent={() => <Text style={styles.galleryTitle}>Kho Ảnh</Text>}
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
              <Button title="Đóng" onPress={() => setModalVisible(false)} />
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
  },
  inputContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: '100%',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  listImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  listNote: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  modalNote: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  galleryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
});
