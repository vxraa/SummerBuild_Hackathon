import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import ProfilePicture from "../assets/icons/ProfilePicture.png";
import NavBar from "../components/NavBar";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../api/authAPI";

const Account = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData == null) {
          console.log("fetching");
          storedUserData = await fetchUserData();
          // Save user data locally
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify(storedUserData)
          );
        }

        const userData = JSON.parse(storedUserData);

        setFirstName(userData.firstName);
        setLastName(userData.lastName);
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };

    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>ACCOUNT</Text>
          </View>
          <View style={styles.userInfoSection}>
            <View>
              <Image source={ProfilePicture} />
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>
                {firstName} {lastName}
              </Text>
              <TouchableOpacity
                style={styles.userInfoSectionProfileContainer}
                onPress={() => navigation.navigate("Profile")}
              >
                <Text style={styles.userInfoSectionProfile}>
                  View my profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.accountSection}>
            <Text style={styles.settings}>Settings</Text>
            <TouchableOpacity
              style={styles.accountItem}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={styles.accountItemText}>Personal Information</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.accountItem}
              onPress={() => navigation.navigate("SavedLocation")}
            >
              <Text style={styles.accountItemText}>Saved Budgets</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.accountItem}
              onPress={() => navigation.navigate("Planner")}
            >
              <Text style={styles.accountItemText}>Total Expenditure</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountItem}>
              <Text style={styles.accountItemText}>Share with Friends</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.accountItem}>
              <Text style={styles.accountItemText}>Help Centre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.accountItem}
              onPress={async () => {
                await logoutUser();
                navigation.navigate("Startpage"); // Replace "Login" with your login screen route name
              }}
            >
              <Text style={styles.accountItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.NavBarContainer}>
        <NavBar />
      </View>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF7F7",
    paddingVertical: 30,
  },
  innerContainer: {
    paddingHorizontal: 20,
  },
  header: {
    padding: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 32,
    color: "#1E3C1F",
    fontFamily: "Poppins-Bold",
  },
  userInfoSection: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: "center",
  },
  userInfoSectionProfile: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    color: "#355E3B",
    fontFamily: "Poppins-Medium",
  },
  userInfoSectionProfileContainer: {},
  userName: {
    fontSize: 24,
    color: "#355E3B",
    fontFamily: "Poppins-Bold",
  },
  userEmail: {
    fontSize: 16,
    color: "#232332",
    marginTop: 5,
    fontFamily: "Poppins-Regular",
  },
  accountSection: {
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  accountItem: {
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#355E3B",
  },
  accountItemText: {
    fontSize: 16,
    color: "#272525",
    fontFamily: "Poppins-Medium",
  },
  settings: {
    fontSize: 21.5,
    marginVertical: 10,
    fontFamily: "Poppins-Bold",
  },
  userTextContainer: {
    flexDirection: "column",
    marginLeft: 20,
  },
  NavBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});