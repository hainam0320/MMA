import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AnniversaryItem({ data }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.date}>{data.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, backgroundColor: '#87CEFA', margin: 10, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 14, color: 'white' },
});
