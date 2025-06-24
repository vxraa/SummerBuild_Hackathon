import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import your preferred icon set

const RoundedSquareIcon = ({
  iconName,
  iconSize = 24,
  iconColor = '#FFFFFF',
  backgroundColor = '#4A90E2',
  size = 50,
}) => {
  return (
    <View style={[styles.container, { backgroundColor, width: size, height: size, borderRadius: size * 0.2 }]}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
    </View>
  );
};

export default RoundedSquareIcon;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});