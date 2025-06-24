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

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SetBudgetModal = ({ visible, onClose, onSetBudget }) => {
  const [budget, setBudget] = useState("");
  const [scaleValue] = useState(new Animated.Value(0)); // Initialize scaling value

  const handleSetBudget = () => {
    if (budget) {
      onSetBudget(budget);
      setBudget(""); // Clear input after setting budget
      onClose(); // Close the modal
    } else {
      alert("Please enter a budget."); // Alert if budget is empty
    }
  };

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    } else {
      Animated.spring(scaleValue, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

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
              backgroundColor="#F47966"
              textColor="#FFFFFF"
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
  closeButton: {
    color: "grey",
    fontSize: screenHeight * 0.04,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  instruction: {
    marginVertical: screenHeight * 0.02,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: screenWidth * 0.04,
    marginBottom: screenHeight * 0.03,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: screenHeight * 0.02,
  },
  closeIcon: {
    height: 32,
    width: 32,
  },
});

export default SetBudgetModal;