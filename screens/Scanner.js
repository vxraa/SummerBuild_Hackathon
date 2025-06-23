import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import CameraButton from "../components/CameraButton";

// Create safe constants to fall back on
const CAMERA_TYPE = {
  back: 'back',
  front: 'front',
};

const FLASH_MODE = {
  off: 'off',
  on: 'on',
};

export default function Scanner() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CAMERA_TYPE.back);
  const [flash, setFlash] = useState(FLASH_MODE.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        await MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
        
        // Verify Camera constants are available
        if (!Camera.Constants) {
          console.warn("Camera.Constants is not available");
        }
      } catch (error) {
        console.error("Permission error:", error);
      }
    })();
  }, []);

  const toggleCameraType = () => {
    setType(prevType => 
      prevType === CAMERA_TYPE.back ? CAMERA_TYPE.front : CAMERA_TYPE.back
    );
  };

  const toggleFlash = () => {
    setFlash(prevFlash => 
      prevFlash === FLASH_MODE.off ? FLASH_MODE.on : FLASH_MODE.off
    );
  };

  const takePicture = async () => {
    if(cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
      } catch(e) {
        console.log(e);
      }
    }
  };

  const saveImage = async () => {
    if(image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('Picture saved!');
        setImage(null);
      } catch(e) {
        console.log(e);
      }
    }
  };

  if(hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <CameraButton 
              icon={'retweet'} 
              onPress={toggleCameraType}
            />
            <CameraButton 
              icon={'flash'} 
              color={flash === FLASH_MODE.off ? 'gray' : '#f1f1f1'}
              onPress={toggleFlash}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{uri: image}} style={styles.camera}/>
      )}
      <View style={styles.bottomContainer}>
        {image ? (
          <View style={styles.imageButtons}>
            <CameraButton title={"Re-take"} icon="retweet" onPress={() => setImage(null)}/>
            <CameraButton title={"Save"} icon="check" onPress={saveImage}/>
          </View>
        ) : (
          <CameraButton title={'Take a picture'} icon='camera' onPress={takePicture}/>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: 'center',
    paddingBottom: 20
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50
  }
});