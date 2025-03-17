import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Cấu hình cách hiển thị thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Hàm yêu cầu quyền thông báo
export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Bạn cần cấp quyền thông báo để nhận nhắc nhở!');
  }
};

// Hàm đặt lịch thông báo
export const scheduleNotification = async (title, body, date) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: { date: new Date(date) }, // Định thời điểm gửi thông báo
  });
};
