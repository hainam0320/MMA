import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [zodiac1, setZodiac1] = useState('');
  const [zodiac2, setZodiac2] = useState('');
  const [startDate, setStartDate] = useState('');
  const [daysTogether, setDaysTogether] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedName1 = await AsyncStorage.getItem('name1');
        const savedName2 = await AsyncStorage.getItem('name2');
        const savedZodiac1 = await AsyncStorage.getItem('zodiac1');
        const savedZodiac2 = await AsyncStorage.getItem('zodiac2');
        const savedDate = await AsyncStorage.getItem('startDate');
        const savedImage1 = await AsyncStorage.getItem('image1');
        const savedImage2 = await AsyncStorage.getItem('image2');
        const savedBackground = await AsyncStorage.getItem('backgroundImage');

        if (savedName1 && savedName2 && savedDate) {
          setName1(savedName1);
          setZodiac1(savedZodiac1);
          setName2(savedName2);
          setZodiac2(savedZodiac2);
          setStartDate(savedDate);
          setDaysTogether(calculateDays(savedDate));
          if (savedImage1) setImage1(savedImage1);
          if (savedImage2) setImage2(savedImage2);
          if (savedBackground) setBackgroundImage(savedBackground);
          setSubmitted(true);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleConfirm = async () => {
    if (name1 && name2 && zodiac1 && zodiac2 && startDate) {
      setDaysTogether(calculateDays(startDate));
      await AsyncStorage.setItem('name1', name1);
      await AsyncStorage.setItem('zodiac1', zodiac1);
      await AsyncStorage.setItem('name2', name2);
      await AsyncStorage.setItem('zodiac2', zodiac2);
      await AsyncStorage.setItem('startDate', startDate);
      if (image1) await AsyncStorage.setItem('image1', image1);
      if (image2) await AsyncStorage.setItem('image2', image2);
      setSubmitted(true);
    }
  };

  const pickImage = async (setImageFunction, storageKey) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageFunction(uri);
      await AsyncStorage.setItem(storageKey, uri);
    }
  };

  const handleBackgroundChange = async () => {
    await pickImage(setBackgroundImage, 'backgroundImage');
    setModalVisible(false); // Ẩn modal ngay sau khi chọn ảnh
  };

  const calculateDays = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị ảnh nền */}
      {backgroundImage && (
        <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />
      )}

      {!submitted ? (
        <View style={styles.inputContainer}>
          <Text style={styles.header}>Nhập thông tin của bạn:</Text>

          <TouchableOpacity onPress={() => pickImage(setImage1, 'image1')}>
            <Image source={image1 ? { uri: image1 } : require('../../assets/couple1.png')} style={styles.avatar} />
          </TouchableOpacity>
          <TextInput placeholder="Tên bạn" value={name1} onChangeText={setName1} style={styles.input} />
          <TextInput placeholder="Cung hoàng đạo" value={zodiac1} onChangeText={setZodiac1} style={styles.input} />

          <TouchableOpacity onPress={() => pickImage(setImage2, 'image2')}>
            <Image source={image2 ? { uri: image2 } : require('../../assets/couple1.png')} style={styles.avatar} />
          </TouchableOpacity>
          <TextInput placeholder="Tên người ấy" value={name2} onChangeText={setName2} style={styles.input} />
          <TextInput placeholder="Cung hoàng đạo người ấy" value={zodiac2} onChangeText={setZodiac2} style={styles.input} />
          <TextInput placeholder="Ngày bắt đầu yêu (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} style={styles.input} />
          <Button title="Xác nhận" onPress={handleConfirm} />
        </View>
      ) : (
        <View style={styles.resultContainer}> 
          <Text style={styles.header}>Kỷ niệm tình yêu</Text>
          <Text style={styles.days}>{daysTogether} ngày</Text>
          <View style={styles.row}>
            <View style={styles.profile}>
              <Image source={image1 ? { uri: image1 } : require('../../assets/couple1.png')} style={styles.avatar} />
              <Text>{name1}</Text>
              <Text>{zodiac1}</Text>
            </View>
            <Text style={styles.heart}>❤️</Text>
            <View style={styles.profile}>
              <Image source={image2 ? { uri: image2 } : require('../../assets/couple1.png')} style={styles.avatar} />
              <Text>{name2}</Text>
              <Text>{zodiac2}</Text>              
            </View>
          </View>
        </View>
      )}

      {/* Nút cài đặt */}
      <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="settings-outline" size={32} color="#FF1493" />
      </TouchableOpacity>

      {/* Modal tùy chọn */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => { setSubmitted(false); setModalVisible(false); }}>
            <Text style={styles.option}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBackgroundChange}>
            <Text style={styles.option}>Chỉnh sửa ảnh nền</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#FFFAF0',
    },
    inputContainer: {
      width: '100%',
      alignItems: 'center',
    },
    input: {
      height: 40,
      borderColor: '#FF69B4',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 8,
      width: '90%',
      borderRadius: 10,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FF1493',
      marginBottom: 15,
    },
    days: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'red',
      marginVertical: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
    },
    profile: {
      alignItems: 'center',
      marginHorizontal: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 5,
    },
    heart: {
      fontSize: 30,
      marginHorizontal: 15,
      color: 'red',
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.3, 
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    option: {
      fontSize: 18,
      padding: 15,
      color: 'white',
      backgroundColor: '#FF69B4',
      borderRadius: 10,
      marginBottom: 10,
    }
  });

  export default HomeScreen;
