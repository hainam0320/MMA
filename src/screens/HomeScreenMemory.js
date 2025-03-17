import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, ActionSheetIOS } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreenMemory({ navigation }) {
  const [anniversaries, setAnniversaries] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadAnniversaries();
    }
  }, [isFocused]);

  const loadAnniversaries = async () => {
    const data = await AsyncStorage.getItem('anniversaries');
    if (data) {
      setAnniversaries(JSON.parse(data));
    }
  };

  const deleteAnniversary = async (index) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa sự kiện này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        onPress: async () => {
          const newList = anniversaries.filter((_, i) => i !== index);
          await AsyncStorage.setItem('anniversaries', JSON.stringify(newList));
          setAnniversaries(newList);
        },
      },
    ]);
  };

  const showActionSheet = (index, item) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Sửa', 'Xóa', 'Hủy'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          navigation.navigate('EditAnniversary', { index, event: item });
        } else if (buttonIndex === 1) {
          deleteAnniversary(index);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={anniversaries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => showActionSheet(index, item)}
          >
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddAnniversary')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9f9f9', 
    padding: 20 
  },
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Cho hiệu ứng bóng trên Android
  },
  image: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 15, 
    borderWidth: 2,
    borderColor: '#dcdcdc' 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333' 
  },
  date: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 3 
  },
  addButton: { 
    width: 60, // Kích thước nút tròn
    height: 60, 
    borderRadius: 30, // Bo tròn để thành hình tròn
    backgroundColor: '#ff7eb3', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute', // Cố định vị trí
    bottom: 100, // Khoảng cách với cạnh dưới
    right: 20, // Khoảng cách với cạnh phải
    shadowColor: '#ff7eb3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6, // Bóng trên Android
  },
  addButtonText: { 
    marginBottom: 5,
    color: 'white', 
    fontSize: 36, // Dấu cộng lớn
    fontWeight: 'bold', 
  },
});
