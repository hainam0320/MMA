import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';

export default function EditAnniversary({ navigation, route }) {
  const { index, event } = route.params;
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(new Date(event.date));
  const [image, setImage] = useState(event.image || null);
  const [showPicker, setShowPicker] = useState(false);

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Hàm đặt lịch thông báo
  const scheduleNotification = async (eventDate, title) => {
    const now = new Date();
    const eventTime = new Date(eventDate);
    let notificationTime = new Date(eventTime);
    notificationTime.setDate(eventTime.getDate() - 1);

    if (notificationTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Sắp đến ngày kỷ niệm 🎉',
          body: `Sự kiện: ${title} sẽ diễn ra vào ngày mai!`,
          sound: 'default',
        },
        trigger: { date: notificationTime },
      });
    }

    if (eventTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hôm nay là ngày kỷ niệm 🎊',
          body: `Sự kiện: ${title} diễn ra hôm nay!`,
          sound: 'default',
        },
        trigger: { date: eventTime },
      });
    }
  };

  // Hàm cập nhật sự kiện
  const updateAnniversary = async () => {
    const data = await AsyncStorage.getItem('anniversaries');
    if (data) {
      let events = JSON.parse(data);
      events[index] = { title, date: date.toISOString(), image };
      await AsyncStorage.setItem('anniversaries', JSON.stringify(events));
      await scheduleNotification(date, title);
      Alert.alert('Thành công', 'Sự kiện đã được cập nhật!');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput 
        value={title} 
        onChangeText={setTitle} 
        style={styles.input} 
      />

      <Text style={styles.label}>Ngày</Text>
      <TouchableOpacity 
        onPress={() => setShowPicker(true)} 
        style={styles.datePickerButton}
      >
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Ảnh</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Chọn ảnh</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={updateAnniversary}>
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#D81B60',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#FF80AB',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  datePickerButton: {
    width: '100%',
    backgroundColor: '#FF80AB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 15,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF80AB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageText: {
    color: '#FF80AB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF4081',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});