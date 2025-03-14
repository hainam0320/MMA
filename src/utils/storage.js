import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveDate = async (date) => {
  try {
    await AsyncStorage.setItem('loveStartDate', date);
  } catch (error) {
    console.error('Error saving date:', error);
  }
};

export const loadDate = async () => {
  try {
    return await AsyncStorage.getItem('loveStartDate');
  } catch (error) {
    console.error('Error loading date:', error);
    return null;
  }
};
