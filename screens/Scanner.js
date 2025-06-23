import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';


const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Requesting Camera Permission...</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission?.granted && permission?.canAskAgain === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Open Setting to enable Camera Function</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openSettings()} // Opens device settings
        >
          <Text style={styles.text}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }


  const takePicture = async () => {
    if (cameraRef.current?.takePictureAsync) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      console.log('Photo URI:', photo.uri);
    } else {
      console.log('Camera reference or method not available');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.text}>📸 Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1, width: '100%' },
  button: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default Scanner;
