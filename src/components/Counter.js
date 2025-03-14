import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Counter({ days }) {
  return (
    <View>
      <Text style={styles.result}>Bạn đã yêu nhau được {days} ngày 💕</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#C71585',
  },
});
