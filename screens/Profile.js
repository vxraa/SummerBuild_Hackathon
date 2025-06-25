import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfilePicture from "../assets/icons/ProfilePicture.png";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ArrowLeft from "../assets/icons/ArrowLeft.png";
import { fetchUserData } from "../api/authAPI";

const Profile = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(new Date());
  const [open, setOpen] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem("userData");
          if (!storedUserData) {
            console.log("fetching");
            const fetchedUserData = await fetchUserData();
            await AsyncStorage.setItem(
              "userData",
              JSON.stringify(fetchedUserData)
            );
          }

          const userData = JSON.parse(storedUserData);

          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
          setPhone(userData.phoneNumber);
          setGender(userData.gender);
          setDob(userData.dob);
        } catch (error) {
          console.error("Failed to load user data", error);

          Alert.alert(
            "Session Expired",
            "Your session has expired. Redirecting to the login page...",
            [
              {
                text: "OK",
                onPress: () => {
                  setTimeout(() => {
                    navigation.navigate("Profile");
                  }, 2000);
                },
              },
            ],
            { cancelable: false }
          );
        }
      };

      loadUserData();
    }, [])
  );

  return (
    <ScrollView style={{backgroundColor: '#FFFFFF'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Account")}
            style={styles.closeButton}
          >
            <Image source={ArrowLeft} />
          </TouchableOpacity>
          <Text style={styles.headerText}>PROFILE</Text>
        </View>
        <View style={styles.userInfoSection}>
          <View>
            <Image source={ProfilePicture} />
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>
              {firstName} {lastName}
            </Text>
            <Text style={styles.userInfoSectionProfile}>Joined - Jun 2025</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} editable={false} />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phone} editable={false} />

          <Text style={styles.label}>Gender</Text>
          <TextInput style={styles.input} value={gender} editable={false} />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput style={styles.input} value={dob} editable={false} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
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
    fontWeight: "bold",
    color: "#1E3C1F",
    fontFamily: "Poppins-Bold",
  },
  userInfoSection: {
    flexDirection: "row",
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
  },
  userInfoSectionProfile: {
    paddingVertical: 10,
    borderRadius: 10,
    color: "#355E3B",
    fontFamily: "Poppins-Medium",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#232332",
    fontFamily: "Poppins-Bold",
  },
  userTextContainer: {
    marginLeft: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#355E3B",
    fontFamily: "Poppins-SemiBold",
  },
  input: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 8,
    fontSize: 15,
    color: "#355E3B",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A4646",
    fontFamily: "Poppins-Medium",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginVertical: 20,
  },
  buttonText: {
    color: "#3A4646",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFDF78",
    borderRadius: 30,
    width: "100%",
    padding: 10,
  },
});