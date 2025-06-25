import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Image,
} from "react-native";
import Button from "../components/Button";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SetBudgetModal = ({ visible, onClose, onSetBudget }) => {
  const [budget, setBudget] = useState("");
  const [scaleValue] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleSetBudget = () => {
    if (budget) {
      onSetBudget(budget);
      setBudget("");
      onClose();
    } else {
      alert("Please enter a budget.");
    }
  };

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleValue, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!fontsLoaded) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ scale: scaleValue }] }]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButtonContainer}
          >
            <Image
              source={require("../assets/icons/Cross.png")}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Set Your Budget</Text>
          <Text style={styles.instruction}>
            Please enter your budget below:
          </Text>
          <TextInput
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
            placeholder="Enter your budget"
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Set Budget"
              onPress={handleSetBudget}
              backgroundColor="#FFDF78"
              textColor="#3A4646"
              borderRadius={25}
              width={screenWidth * 0.4}
              height={screenHeight * 0.055}
              fontSize={screenHeight * 0.02}
              paddingVertical={screenHeight * 0.001}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: screenWidth * 0.07,
    position: "relative",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 22,
    right: 18,
    zIndex: 1,
  },
  closeIcon: {
    height: 32,
    width: 32,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  instruction: {
    marginVertical: screenHeight * 0.02,
    fontFamily: "Poppins_400Regular",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: screenWidth * 0.04,
    marginBottom: screenHeight * 0.03,
    fontFamily: "Poppins_400Regular",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: screenHeight * 0.02,
  },
});

export default SetBudgetModal;
