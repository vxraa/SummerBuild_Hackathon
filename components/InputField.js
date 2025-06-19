import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = ({ label, placeholder, secureTextEntry, value, onChangeText, style, marginBottom = 20, keyboardType, labelStyle, inputStyle }) => {
  return (
    <View style={[styles.container, { marginBottom }]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[styles.input, style, inputStyle]}
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
    color: '#355E3B',
  },
});

export default InputField;