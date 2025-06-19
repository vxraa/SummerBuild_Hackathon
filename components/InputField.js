import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = ({ label, placeholder, secureTextEntry, value, onChangeText, style, marginBottom = 20, keyboardType }) => {
  return (
    <View style={[styles.container, { marginBottom }]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontFamily: 'Nunito_400Regular',
    backgroundColor: '#FFFFFF',
  },
});

export default InputField;