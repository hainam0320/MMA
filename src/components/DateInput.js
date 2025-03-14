import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function DateInput({ value, onChange }) {
  return (
    <TextInput
      style={styles.input}
      placeholder="YYYY-MM-DD"
      value={value}
      onChangeText={onChange}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#FF69B4',
    padding: 10,
    width: '80%',
    borderRadius: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
});
