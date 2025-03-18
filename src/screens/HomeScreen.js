import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [age1, setAge1] = useState('');
  const [age2, setAge2] = useState('');
  const [gender1, setGender1] = useState('');
  const [gender2, setGender2] = useState('');
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
        const savedData = await AsyncStorage.multiGet([
          'name1', 'name2', 'age1', 'age2', 'gender1', 'gender2',
          'zodiac1', 'zodiac2', 'startDate', 'image1', 'image2', 'backgroundImage'
        ]);
        
        savedData.forEach(([key, value]) => {
          if (value !== null) {
            switch (key) {
              case 'name1': setName1(value); break;
              case 'name2': setName2(value); break;
              case 'age1': setAge1(value); break;
              case 'age2': setAge2(value); break;
              case 'gender1': setGender1(value); break;
              case 'gender2': setGender2(value); break;
              case 'zodiac1': setZodiac1(value); break;
              case 'zodiac2': setZodiac2(value); break;
              case 'startDate': 
                setStartDate(value); 
                setDaysTogether(calculateDays(value));
                break;
              case 'image1': setImage1(value); break;
              case 'image2': setImage2(value); break;
              case 'backgroundImage': setBackgroundImage(value); break;
            }
          }
        });

        if (name1 && name2 && startDate) setSubmitted(true);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleConfirm = async () => {
    // Kiểm tra tên
    if (!name1.trim() || !/^[A-Za-zÀ-ỹ\s]+$/.test(name1)) {
      alert('Tên của bạn không hợp lệ! Chỉ được chứa chữ cái và khoảng trắng.');
      return;
    }
    if (!name2.trim() || !/^[A-Za-zÀ-ỹ\s]+$/.test(name2)) {
      alert('Tên người ấy không hợp lệ! Chỉ được chứa chữ cái và khoảng trắng.');
      return;
    }
  
    // Kiểm tra tuổi
    if (!/^\d+$/.test(age1) || parseInt(age1) <= 0) {
      alert('Tuổi của bạn phải là số nguyên dương!');
      return;
    }
    if (!/^\d+$/.test(age2) || parseInt(age2) <= 0) {
      alert('Tuổi của người ấy phải là số nguyên dương!');
      return;
    }
  
    // Kiểm tra giới tính
    if (!["nam", "nữ"].includes(gender1.toLowerCase())) {
      alert('Giới tính của bạn phải là "Nam" hoặc "Nữ"!');
      return;
    }
    if (!["nam", "nữ"].includes(gender2.toLowerCase())) {
      alert('Giới tính của người ấy phải là "Nam" hoặc "Nữ"!');
      return;
    }
  
    // Kiểm tra cung hoàng đạo
    if (!zodiac1.trim()) {
      alert('Bạn chưa nhập cung hoàng đạo của mình!');
      return;
    }
    if (!zodiac2.trim()) {
      alert('Bạn chưa nhập cung hoàng đạo của người ấy!');
      return;
    }
  
    // Kiểm tra ngày bắt đầu yêu
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate)) {
      alert('Ngày bắt đầu yêu phải có định dạng YYYY-MM-DD!');
      return;
    }
    const start = new Date(startDate);
    const today = new Date();
    if (start > today) {
      alert('Ngày bắt đầu yêu không thể là ngày trong tương lai!');
      return;
    }
  
    // Lưu vào AsyncStorage và cập nhật trạng thái
    setDaysTogether(calculateDays(startDate));
    await AsyncStorage.multiSet([
      ['name1', name1], ['name2', name2], ['age1', age1], ['age2', age2],
      ['gender1', gender1], ['gender2', gender2], ['zodiac1', zodiac1], ['zodiac2', zodiac2],
      ['startDate', startDate],
      image1 ? ['image1', image1] : [], image2 ? ['image2', image2] : []
    ]);
    setSubmitted(true);
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
      {backgroundImage && (
        <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />
      )}
      {!submitted ? (
        <View style={styles.inputContainer}>
          <Text style={styles.header}>Nhập thông tin của bạn:</Text>
          <TextInput placeholder="Tên bạn" value={name1} onChangeText={setName1} style={styles.input} />
          <TextInput placeholder="Tuổi của bạn" value={age1} onChangeText={setAge1} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Giới tính của bạn" value={gender1} onChangeText={setGender1} style={styles.input} />
          <TextInput placeholder="Cung hoàng đạo" value={zodiac1} onChangeText={setZodiac1} style={styles.input} />

          <TextInput placeholder="Tên người ấy" value={name2} onChangeText={setName2} style={styles.input} />
          <TextInput placeholder="Tuổi người ấy" value={age2} onChangeText={setAge2} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Giới tính người ấy" value={gender2} onChangeText={setGender2} style={styles.input} />
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
              <Text>{name1} ({age1})</Text>
                <Ionicons
                  name={gender1.toLowerCase() === 'nam' ? "male" : "female"}
                  size={24}
                  color={gender1.toLowerCase() === 'nam' ? "#0000FF" : "#FF1493"}
                />
              <Text>{zodiac1}</Text>
            </View>
            <Text style={styles.heart}>❤️</Text>
            <View style={styles.profile}>
              <Image source={image2 ? { uri: image2 } : require('../../assets/couple1.png')} style={styles.avatar} />
              <Text>{name2} ({age2})</Text>
                <Ionicons
                  name={gender2.toLowerCase() === 'nam' ? "male" : "female"}
                  size={24}
                  color={gender2.toLowerCase() === 'nam' ? "#0000FF" : "#FF1493"}
                />
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
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelOption}>Hủy</Text>
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
    padding: 0,
    backgroundColor: '#FFFAF0',
  },
  cancelOption: {
    fontSize: 18,
    padding: 15,
    color: '#FF1493',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF1493',
    marginTop: 10,
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
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF1493',
    marginBottom: 15,
  },
  days: {
    textAlign: 'center',
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
