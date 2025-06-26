import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal
} from "react-native";
import ProfilePicture from "../assets/icons/ProfilePicture.png";
import { useNavigation } from "@react-navigation/native";
import ArrowLeft from "../assets/icons/ArrowLeft.png";
import Edit from "../assets/icons/editprofile.png";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import { updateProfile, fetchUserData } from "../api/authAPI";
import { ScrollView } from "react-native-gesture-handler";

const EditProfile = () => {
  const navigation = useNavigation();
  const [firstname, setFirstName] = useState(null);
  const [lastname, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [gender, setGender] = useState(null);
  const [dobDate, setDobDate] = useState(null);
  const [dobStr, setDobStr] = useState("--/--/----");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData == null) {
          console.log("fetching");
          const fetchedUserData = await fetchUserData();
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify(fetchedUserData)
          );
        }
        console.log("stored user data: ", storedUserData);

        const userData = JSON.parse(storedUserData || "{}");
        setFirstName(userData.user.firstname);
        setLastName(userData.user.lastname);
        setEmail(userData.user.email);
        setPhone(userData.user.phone);
        setGender(userData.user.gender);
        setDobDate(new Date(userData.user.dob));
        setDobStr(formatDate(new Date(userData.user.dob)));
      } catch (error) {
        console.error("Failed to load user data", error);

        Alert.alert(
          "Session Expired",
          "Your session has expired. Redirecting to the login page...",
          [
            {
              text: "OK",
              onPress: () =>
                setTimeout(() => navigation.navigate("EditProfile"), 2000),
            },
          ],
          { cancelable: false }
        );
      }
    };

    loadUserData();
  }, []);

  function formatDate(date, format = "dd/mm/yyyy") {
    if (!(date instanceof Date) || isNaN(date)) {
      throw new Error("Invalid Date object provided");
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    if (format === "dd/mm/yyyy") {
      return `${day}/${month}/${year}`;
    } else if (format === "yyyy-mm-dd") {
      return `${year}-${month}-${day}`;
    } else {
      throw new Error(
        "Invalid format specified. Use 'dd/mm/yyyy' or 'yyyy-mm-dd'."
      );
    }
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    console.log("A date has been picked: ", date);
    setDobDate(date);
    setDobStr(formatDate(date));
    hideDatePicker();
  };

  const updateUserDataInAsyncStorage = async (newUserData) => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      let userData = {};
      console.log("storeduserdata: ", storedUserData)

      if (storedUserData !== null) {
        userData = JSON.parse(storedUserData);
      }

      userData.firstname = newUserData.firstname || userData.firstname;
      userData.lastname = newUserData.lastname || userData.lastname;
      userData.email = newUserData.email || userData.email;
      userData.phoneNumber = newUserData.phoneNumber || userData.phoneNumber;
      userData.gender = newUserData.gender || userData.gender;
      userData.dob = newUserData.dob || userData.dob;

      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      console.log("[AsyncStorage] User data updated successfully");
    } catch (error) {
      console.error("Error updating user data in AsyncStorage", error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleUpdate = async () => {
    try {
      let dob_string = dobDate.toISOString().split("T")[0];
      console.log("")
      const userData = await updateProfile(
        firstname,
        lastname,
        email,
        phone,
        gender,
        dob_string
      );
      

      await updateUserDataInAsyncStorage(userData);

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been updated successfully.",
      });
      navigation.navigate("Profile");
    } catch (error) {
      Alert.alert(
        "Session Expired",
        "Your session has expired. Redirecting to the login page...",
        [
          {
            text: "OK",
            onPress: () => setTimeout(() => navigation.navigate("EditProfile"), 2000),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const GenderPickerModal = () => {
    const genders = ["Male", "Female", "Other"];
    
    return (
      <Modal
        transparent={true}
        visible={showGenderPicker}
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {genders.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.genderOption}
                onPress={() => {
                  setGender(item);
                  setShowGenderPicker(false);
                }}
              >
                <Text style={styles.genderOptionText}>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAwareScrollView
        style={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.scrollContainer}
        extraHeight={150}
        enableAutomaticScroll={true}
      >
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.closeButton}
            >
              <Image source={ArrowLeft} />
            </TouchableOpacity>
            <Text style={styles.headerText}>EDIT PROFILE</Text>
          </View>
          <View style={styles.userInfoSection}>
            <View>
              <Image source={ProfilePicture} style={styles.image} />
              <TouchableOpacity style={styles.editContainer}>
                <Image source={Edit} style={styles.edit} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.mainInputContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.nameInput}
                  value={firstname}
                  editable={true}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.nameInput}
                  value={lastname}
                  editable={true}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.emailInput}
              value={email}
              editable={true}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              editable={true}
              onChangeText={setPhone}
            />

            <View style={styles.inputContainer}>
              <View style={[styles.inputGroup, styles.genderGroup]}>
                <Text style={styles.label}>Gender</Text>
                <TouchableOpacity 
                  style={styles.genderInput}
                  onPress={() => setShowGenderPicker(true)}
                >
                  <Text style={gender ? styles.selectedGenderText : styles.placeholderText}>
                    {gender || "Select Gender"}
                  </Text>
                </TouchableOpacity>
                <GenderPickerModal />
              </View>
              <View style={[styles.inputGroup, styles.flexFill]}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity onPress={showDatePicker}>
                  <Text style={styles.nameInput}>{dobStr}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    marginRight: 20,
  },
  headerText: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "#1E3C1F",
  },
  userInfoSection: {
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  image: {
    width: 100,
    height: 100,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 5,
    marginTop: 20,
    marginLeft: 5,
    color: "#355E3B",
  },
  input: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 8,
    fontSize: 15,
    color: "#355E3B",
    borderWidth: 1,
    borderColor: "#3A4646",
    fontFamily: "Poppins-Medium",
  },
  emailInput: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 8,
    fontSize: 15,
    color: "#355E3B",
    borderWidth: 1,
    borderColor: "#3A4646",
    fontFamily: "Poppins-Medium",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 55,
    borderRadius: 30,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFDF78",
    borderRadius: 30,
    width: "100%",
    padding: 10,
  },
  buttonText: {
    color: "#3A4646",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  genderInput: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 8,
    fontSize: 15,
    color: "#355E3B",
    borderWidth: 1,
    borderColor: "#3A4646",
    fontFamily: "Poppins_Medium",
    height: 52.5,

  },
  nameInput: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 8,
    fontSize: 15,
    color: "#355E3B",
    borderWidth: 1,
    borderColor: "#3A4646",
    fontFamily: "Poppins-Medium",
  },
  editContainer: {
    position: "absolute",
    bottom: 0,
    right: -10,
  },
  mainInputContainer: {
    marginHorizontal: 10,
  },
  flexFill: {
    flex: 2,
  },
  genderGroup: {
    minWidth: 150,
    flex: 0,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  genderOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  genderOptionText: {
    fontSize: 16,
    color: "#355E3B",
    fontFamily: "Poppins-Medium",
  },
  cancelButton: {
    padding: 15,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#355E3B",
    fontFamily: "Poppins-Medium",
  },
  selectedGenderText: {
    fontSize: 15,
    color: "#355E3B",
    fontFamily: "Poppins-Medium",
  },
  placeholderText: {
    color: "#999",
  }
});