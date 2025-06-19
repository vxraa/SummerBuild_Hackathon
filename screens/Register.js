import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateEmail } from "../utils/authUtil";
import { signup } from "../api/authAPI";
import VectorBackground from "../assets/images/VectorBackground.png";

const { width, height } = Dimensions.get('window');

const Register = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleRegister = async () => {
    if (!email || !password || !firstname || !lastname || !confirmpassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password !== confirmpassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const userData = await signup(firstname, lastname, email, password);
      await AsyncStorage.setItem("userData", JSON.stringify(userData.user));
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error.message || "An error occurred during registration"
      );
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {/* Green background for top portion */}
      <View style={styles.topBackground} />

      {/* White background for bottom portion */}
      <ImageBackground 
        source={VectorBackground} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.content}>
            <View style={styles.contentContainer}>
              <Text style={styles.header}>Register</Text>
              
              <View style={styles.nameFieldsContainer}>
                <View style={styles.nameFieldWrapper}>
                  <InputField
                    label="First Name"
                    value={firstname}
                    onChangeText={setFirstName}
                    keyboardType="default"
                    placeholder="John"
                    containerStyle={styles.nameInputField}
                    labelStyle={styles.inputLabel}
                    inputStyle={styles.nameInput}
                  />
                </View>
                <View style={styles.nameFieldWrapper}>
                  <InputField
                    label="Last Name"
                    value={lastname}
                    onChangeText={setLastName}
                    keyboardType="default"
                    placeholder="Doe"
                    containerStyle={styles.nameInputField}
                    labelStyle={styles.inputLabel}
                    inputStyle={styles.nameInput}
                  />
                </View>
              </View>

              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="JohnDoe@gmail.com"
                containerStyle={styles.inputField}
                labelStyle={styles.inputLabel}
                inputStyle={{ color: '#355E3B' }}
              />

              <PasswordField 
                label="Password" 
                value={password} 
                onChangeText={setPassword}
                placeholder="Enter your password"
                containerStyle={styles.passwordField}
                labelStyle={styles.inputLabel}
                inputStyle={{ color: '#355E3B' }}
              />

              <View style={styles.confirmPasswordWrapper}>
                <PasswordField 
                    label="Confirm Password" 
                    value={confirmpassword} 
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    containerStyle={styles.passwordField}
                    labelStyle={styles.inputLabel}
                    inputStyle={{ color: '#355E3B' }}
                />
              </View>
              

              <Button
                title="Register"
                onPress={handleRegister}
                backgroundColor="#FFDF78"
                textColor="#3A4646"
                fontSize={16}
                paddingVertical={10}
                borderRadius={100}
                width="100%"
                style={styles.registerButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Login Here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: '#1E3C1F',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.8,
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 30,
    width: '100%',
    maxWidth: 453,
    alignSelf: 'center',
    marginTop: -200,
  },
  header: {
    fontSize: 36,
    color: "#355E3B",
    fontFamily: "Poppins_700Bold",
    marginBottom: 42,
    marginTop: 200,
    textAlign: 'center',
  },
  inputField: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 0,
  },
  passwordField: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 0,
    marginTop: 0,
  },
  confirmPasswordWrapper: {
    marginTop: -20, 
  },
  nameInputField: {
    width: 163,
    height: 68,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginBottom: 0,
  },
  nameInput: {
    color: '#355E3B',
    height: 40,
  },
  inputLabel: { 
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#355E3B',
    marginBottom: 8,
  },
  registerButton: {
    marginTop: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nameFieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  nameFieldWrapper: {
    width: 163,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 48,
  },
  loginText: {
    fontSize: 16,
    color: "#3A4646",
    fontFamily: "Poppins_400Regular",
  },
  loginLink: {
    fontSize: 16,
    color: "#355E3B",
    fontFamily: "Poppins_600SemiBold",
  },
});

export default Register;