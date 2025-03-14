import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [zodiac1, setZodiac1] = useState('');
  const [zodiac2, setZodiac2] = useState('');
  const [startDate, setStartDate] = useState('');
  const [daysTogether, setDaysTogether] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedName1 = await AsyncStorage.getItem('name1');
        const savedName2 = await AsyncStorage.getItem('name2');
        const savedZodiac1 = await AsyncStorage.getItem('zodiac1');
        const savedZodiac2 = await AsyncStorage.getItem('zodiac2');
        const savedDate = await AsyncStorage.getItem('startDate');

        if (savedName1 && savedName2 && savedDate) {
          setName1(savedName1);
          setZodiac1(savedName1);
          setName2(savedName2);
          setZodiac2(savedName2);
          setStartDate(savedDate);
          setDaysTogether(calculateDays(savedDate));
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
      setSubmitted(true);
    }
  };

  const handleEdit = () => {
    setSubmitted(false);
  };

  const calculateDays = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Đổi mili giây thành ngày
  };

  return (
    <View style={styles.container}>
      {!submitted ? (
        <View style={styles.inputContainer}>
          <Text style={styles.header}>Nhập thông tin của bạn:</Text>
          <TextInput placeholder="Tên bạn" value={name1} onChangeText={setName1} style={styles.input} />
          <TextInput placeholder="Cung hoàng đạo" value={zodiac1} onChangeText={setZodiac1} style={styles.input} />
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
            <Image source={require('../../assets/couple1.png')} style={styles.avatar} />
              <Text>{name1}</Text>
              <Text>{zodiac1}</Text>
            </View>
            <Text style={styles.heart}>❤️</Text>
            <View style={styles.profile}>
            <Image source={require('../../assets/couple1.png')} style={styles.avatar} />
              <Text>{name2}</Text>
              <Text>{zodiac2}</Text>
            </View>
          </View>
          <Button title="Chỉnh sửa" onPress={handleEdit} />
        </View>
      )}
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
  },
  heart: {
    fontSize: 30,
    marginHorizontal: 15,
    color: 'red',
  },
});

export default HomeScreen;