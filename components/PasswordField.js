import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from './InputField';

const PasswordField = ({ label, value, onChangeText, placeholder, marginBottom = 20 }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={[styles.container, { marginBottom }]}>
      <InputField
        label={label}
        secureTextEntry={!passwordVisible}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.eyeIcon}
        onPress={togglePasswordVisibility}
      >
        <Icon name={passwordVisible ? "eye" : "eye-slash"} size={20} color="#777777" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 40,
  },
});

export default PasswordField;