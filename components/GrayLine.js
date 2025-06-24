import React from 'react';
import { View } from 'react-native';

// GrayLine Component with customizable width, height, color, and marginBottom
const GrayLine = ({ width, height, color = '#D3D3D3', marginBottom = 0, marginTop = 0}) => {
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: color,
        borderRadius: 5, 
        marginBottom: marginBottom,
        marginTop: marginTop,
      }}
    />
  );
};

export default GrayLine;
