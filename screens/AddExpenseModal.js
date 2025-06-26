import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Toast from 'react-native-toast-message';
import Button from "../components/Button";
import GrayLine from "../components/GrayLine";
import RoundedSquareIcon from "../components/RoundedSquareIcon";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fetchUserData } from "../api/authAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const scaleFont = (size) => (screenWidth / 375) * size;
const iconSize = screenWidth * 0.2;

const iconData = [
  {
    id: "shopping",
    iconName: "cart",
    backgroundColor: "#EEF4F8",
    iconColor: "#81B2CA",
    label: "Shopping",
  },
  {
    id: "lodging",
    iconName: "home",
    backgroundColor: "#faeee6",
    iconColor: "#c46d33",
    label: "Lodging",
  },
  {
    id: "food",
    iconName: "restaurant",
    backgroundColor: "#EEEBED",
    iconColor: "#836F81",
    label: "Food",
  },
  {
    id: "transport",
    iconName: "bus",
    backgroundColor: "#E5EEED",
    iconColor: "#42887B",
    label: "Transport",
  },
  {
    id: "activities",
    iconName: "color-palette",
    backgroundColor: "#f5e4ef",
    iconColor: "#c957a5",
    label: "Activities",
  },
  {
    id: "health",
    iconName: "medkit",
    backgroundColor: "#faf6e1",
    iconColor: "#e3bc0e",
    label: "Health",
  },
  {
    id: "souvenirs",
    iconName: "gift",
    backgroundColor: "#f5e1e3",
    iconColor: "#c95762",
    label: "Souvenirs",
  },
  {
    id: "others",
    iconName: "albums",
    backgroundColor: "#e6fae7",
    iconColor: "#418743",
    label: "Others",
  },
];

const AddExpenseModal = ({ visible, onClose, onAdd }) => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState(""); // Changed from newExpense
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [paymentType, setPaymentType] = useState("Cash");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        let storedUserData = await AsyncStorage.getItem("userData");
        if (!storedUserData) {
          console.log("Fetching user data...");
          storedUserData = await fetchUserData();
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify(storedUserData)
          );
        }

        const userData = JSON.parse(storedUserData);
        const userId = userData.user?.id || userData.id;
        if (!userId) throw new Error("User ID not found");
        setUserId(userId);
        console.log(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
        Alert.alert("Error", "Unable to load user data. Please try again.");
      }
    };

    loadUserId();
  }, []);

  if (!visible) return null;

  const handleAddExpense = async () => {
  // Validate inputs
  if (!amount.trim() || !selectedCategory) {
    Alert.alert(
      "Incomplete Input",
      "Please enter an amount and select a category."
    );
    return;
  }

  // Prepare the expense data
  const expenseData = {
    vendor: description.trim(),       // Changed from name to vendor
    total: parseFloat(amount.trim()), // Changed from amount to total
    date: date.toISOString().split('T')[0],
    category: selectedCategory,
    user_id: userId
  };

  try {
    const response = await onAdd(expenseData);
    console.log("Expense added successfully:", response);

    // Reset form
    setAmount("");
    setDescription("");
    setSelectedCategory(null);
    setDate(new Date());
    onClose();
    
    // Show success message
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Expense added successfully",
    });

    return response;
  } catch (error) {
    console.error("Error adding expense:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error.message || "Failed to add expense",
    });
    throw error;
  }
};

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <GrayLine
              width={screenWidth * 0.2}
              height={screenHeight * 0.005}
              marginBottom={screenHeight * 0.03}
            />
            <Text style={styles.modalHeader}>Add Expense</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencyText}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value= {description}
                onChangeText={setDescription}
                keyboardType="default"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.currencyText}>SGD</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.currencyText}>Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={showDatePicker}
              >
                <Text style={styles.dateText}>
                  {date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
            {/* <View style={styles.inputContainer}>
              <Text style={styles.currencyText}>Payment type</Text>
              <Picker
                selectedValue={paymentType}
                onValueChange={(itemValue) => setPaymentType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Credit Card" value="Credit Card" />
                <Picker.Item label="Debit Card" value="Debit Card" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View> */}

            <GrayLine
              width={screenWidth * 0.9}
              height={screenHeight * 0.0025}
              marginTop={10}
            />
            <Text style={styles.categoryHeader}>Category</Text>

            <View style={styles.iconGrid}>
              {iconData.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.iconWrapper}
                  onPress={() => handleSelectCategory(item.label)}
                >
                  <RoundedSquareIcon
                    iconName={item.iconName}
                    iconSize={screenWidth * 0.08}
                    iconColor={item.iconColor}
                    backgroundColor={
                      selectedCategory === item.label
                        ? "#FFCC00"
                        : item.backgroundColor
                    }
                    size={iconSize}
                  />
                  <Text style={styles.iconLabel} numberOfLines={2}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="+  Add"
                onPress={handleAddExpense}
                backgroundColor="#FFDF78"
                textColor="#3A4646"
                paddingVertical={screenHeight * 0.006}
                borderRadius={25}
                width={90}
                marginTop={20}
                fontSize={14}
                
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddExpenseModal;
export { iconData };

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: screenWidth,
    height: screenHeight * 0.8,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.02,
    paddingBottom: screenHeight * 0.05,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  modalHeader: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 34,
    marginBottom: screenHeight * 0.005,
  },
  currencyText: {
    fontSize: scaleFont(16),
    marginRight: 10,
  },
  input: {
    width: screenWidth * 0.2,
    height: 40,
    textAlign: "right",
    fontSize: scaleFont(16),
  },
  dateInput: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: scaleFont(16),
    color: "#333333",
  },
  buttonContainer: {
    bottom: screenHeight * 0.025,
    width: "100%",
    alignItems: "center",
  },
  categoryHeader: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    marginVertical: screenHeight * 0.03,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: screenHeight * 0.02,
  },
  iconWrapper: {
    width: "24%", // Wider icons to fit 4 per row
    alignItems: "center",
    marginBottom: screenHeight * 0.03,
  },
  iconLabel: {
    fontSize: scaleFont(12),
    textAlign: "center",
    marginTop: 5,
  },
  picker: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    width: 160,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginRight: -10,
  },
});