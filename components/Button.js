import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Button = ({ 
  title, 
  onPress, 
  backgroundColor = '#FFDF78',
  textColor = '#3A4646', 
  paddingVertical = 10, 
  borderRadius = 100, 
  marginTop = 5, 
  borderColor = '#FFDF78', 
  borderWidth = 2, 
  width = 'auto', 
  height = 'auto', // New prop for height with a default value
  iconName = null, 
  iconSize = 24, 
  iconColor = '#3A4646', 
  style,
  fontSize = 18, // New prop for font size with a default value
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor, 
          paddingVertical, 
          borderRadius, 
          marginTop,
          borderColor, 
          borderWidth, 
          width, 
          height, // Apply custom height
          borderStyle: 'solid', 
        }, 
        style
      ]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        {iconName && (
          <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
        )}
        <Text style={[styles.buttonText, { color: textColor, fontSize }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, 
    borderColor: '#3A4646', 
  },
  buttonContent: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  buttonText: {
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});

export default Button;
