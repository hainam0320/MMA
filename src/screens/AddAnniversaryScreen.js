import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddAnniversaryScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [image, setImage] = useState(null);

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

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

  const saveAnniversary = async () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề sự kiện.");
      return;
    }

    try {
      const newEvent = { title, date: date.toISOString(), image };
      const storedEvents = await AsyncStorage.getItem("anniversaries");
      const events = storedEvents ? JSON.parse(storedEvents) : [];
      events.push(newEvent);
      await AsyncStorage.setItem("anniversaries", JSON.stringify(events));

      Alert.alert("Thành công", "Sự kiện đã được lưu!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu sự kiện.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>🎉 Tiêu đề sự kiện:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề..."
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>📅 Chọn ngày:</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showPicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}

      <Text style={styles.label}>📸 Chọn ảnh:</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Chọn ảnh từ thư viện</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.saveButton} onPress={saveAnniversary}>
        <Text style={styles.saveButtonText}>💾 Lưu sự kiện</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFE4E1" },
  label: { fontSize: 18, fontWeight: "bold", marginTop: 10, color: "#FF69B4" },
  input: {
    borderWidth: 2,
    borderColor: "#FFB6C1",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  dateButton: {
    padding: 12,
    backgroundColor: "#FF69B4",
    borderRadius: 10,
    marginTop: 5,
    alignItems: "center",
  },
  dateText: { fontSize: 16, color: "#fff" },
  imagePicker: {
    padding: 12,
    backgroundColor: "#FFB6C1",
    borderRadius: 10,
    marginTop: 5,
    alignItems: "center",
  },
  imagePickerText: { fontSize: 16, color: "#fff" },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FF69B4",
  },
  saveButton: {
    padding: 14,
    backgroundColor: "#FF1493",
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default AddAnniversaryScreen;