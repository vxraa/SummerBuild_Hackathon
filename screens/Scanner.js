import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native'; // ✅ Import useNavigation
import { BASE_URL } from '../config';
import { getUserIdFromStorage } from '../api/authAPI';
import DropDownPicker from 'react-native-dropdown-picker';

const Scanner = () => {
  // Your existing state
  const [photoUri, setPhotoUri] = useState(null);
  const [photoObject, setPhotoObject] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [saveStatus, setSaveStatus] = useState(''); 
  const [receiptData, setReceiptData] = useState(null);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);


  const [items, setItems] = useState([
  { label: 'Shopping', value: 'shopping' },
  { label: 'Lodging', value: 'lodging' },
  { label: 'Food', value: 'food' },
  { label: 'Transport', value: 'transport' },
  { label: 'Activities', value: 'activities' },
  { label: 'Health', value: 'health' },
  { label: 'Souvenirs', value: 'souvenirs' },
  { label: 'Others', value: 'others' },
]);

  const cameraRef = useRef(null);

  const navigation = useNavigation(); 


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
        <Text style={styles.text}>Open Settings to enable Camera Function</Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openSettings()}>
          <Text style={styles.text}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const takePicture = async () => {
  if (cameraRef.current) {
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoUri(photo.uri);
    setPhotoObject(photo);
  }
};


  const sendPhotoToVeryfi = async (photo) => {
    try {
      const userId = await getUserIdFromStorage();
      console.log("userid: ", userId)
      if (!userId) {
        console.error('No user ID found — user may not be logged in');
        setSaveStatus('User not logged in, cannot save receipt');
        return;
      }

      const fileUri = photo.uri;
      const fileName = fileUri.split('/').pop();

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: 'image/jpeg',
      });

      const response = await fetch('https://api.veryfi.com/api/v8/partner/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'CLIENT-ID': 'vrfmjFLXp7A5gJ83840MTPFOAWHmxh1kXHCcs5E',
          Authorization: `apikey chuashunkah:a35d964bd4e7a60953fa692418251654`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!category){
        console.error("No category inputted")
      }

      if (!response.ok) {
        console.error('Veryfi Error:', result);
        setSaveStatus('Failed to process receipt with Veryfi');
        return;
      }

      const calculatedTotal = result.line_items?.reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
      console.log("calculatedTotal:", calculatedTotal);

      const formattedDate = result.date?.split(" ")[0];

      setReceiptData({
        vendor: result.vendor?.name,
        date: formattedDate,
        total: calculatedTotal,
      });

      // Save to backend
      console.log('Sending to backend:', {
        user_id: userId,
        vendor: result.vendor?.name,
        date: formattedDate,
        total: calculatedTotal,
        category: category,
        full_data: JSON.stringify(result),
      });
      const backendResponse = await fetch(`${BASE_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || 0,
          vendor: result.vendor?.name || 'Unknown Vendor',
          date: formattedDate,
          total: calculatedTotal,
          category: category,
          full_data: JSON.stringify(result),
        }),
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error('Backend save failed:', errorText);
        setSaveStatus('Failed to save receipt data to backend');
        return;
      }

      const backendResult = await backendResponse.json();
      console.log('Saved to DB:', backendResult);
      setSaveStatus('Receipt saved successfully!');  // <-- success message

    } catch (error) {
      console.error('Error in photo processing:', error.message || error);
      setSaveStatus('Error during receipt processing');
    }
  };

  return (
              <View style={styles.container}>
            
                {/* ✅ Back Button at Top-Left */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                {photoUri ? (
                  <>
                    <Image source={{ uri: photoUri }} style={styles.camera} />
                    <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => setPhotoUri(null)}>
              <Text style={styles.text}>🔁 Retake Photo</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ marginTop: 10 }}>Select Category:</Text>
        <View style={{ width: '80%', zIndex: 1000, marginBottom: 20 }}>
          <DropDownPicker
            open={open}
            value={category}
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="Select a category..."
            containerStyle={{ height: 50 }}
            style={{ backgroundColor: '#fff' }}
            dropDownContainerStyle={{ backgroundColor: '#eee' }}
          />
        </View>

          <TouchableOpacity style={styles.button} onPress={() => sendPhotoToVeryfi(photoObject)}>
            <Text style={styles.text}>✅ Submit Photo</Text>
          </TouchableOpacity>


          {/* Display receipt info */}
          {receiptData && (
            <View style={{ padding: 20 }}>
              <Text>Vendor: {receiptData.vendor}</Text>
              <Text>Date: {receiptData.date}</Text>
              <Text>Total: ${receiptData.total}</Text>
            </View>
          )}

          {/* Display save status message */}
          {saveStatus ? (
            <View style={{ padding: 10 }}>
              <Text style={{ color: saveStatus.includes('failed') || saveStatus.includes('error') ? 'red' : 'green' }}>
                {saveStatus}
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <>
          <CameraView style={styles.camera} ref={cameraRef} />
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>📸 Take Photo</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: {  width: '100%', height:300 },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 0,  
    marginHorizontal: 0,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default Scanner;
