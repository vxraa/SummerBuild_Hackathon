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
import { loginUser } from "../api/authAPI";
import VectorBackground from "../assets/images/VectorBackground.png";

const { width, height } = Dimensions.get('window');

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const userData = await loginUser(email, password);
      await AsyncStorage.setItem("userData", JSON.stringify(userData.user));
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Invalid email or password");
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
              <Text style={styles.header}>Login</Text>
            
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
                containerStyle={styles.inputField}
                labelStyle={styles.inputLabel}
                inputStyle={{ color: '#355E3B' }}
              />

              <Button
                title="Log in"
                onPress={handleLogin}
                backgroundColor="#FFDF78"
                textColor="#3A4646"
                fontSize={16}
                paddingVertical={10}
                borderRadius={100}
                width="100%"
                style={styles.loginButton}
              />

              <View style={styles.registrationContainer}>
                <Text style={styles.registrationText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                  <Text style={styles.registerLink}>Register Here</Text>
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
    marginTop: -200, // Adjust this to position the form vertically
  },
  header: {
    fontSize: 36,
    color: "#355E3B",
    fontFamily: "Poppins_700Bold",
    marginBottom: 70,
    marginTop: 150,
    textAlign: 'center',
  },
  inputField: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  inputLabel: { 
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#355E3B',
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  registrationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 113,
  },
  registrationText: {
    fontSize: 16,
    color: "#3A4646",
    fontFamily: "Poppins_400Regular",
  },
  registerLink: {
    fontSize: 16,
    color: "#355E3B",
    fontFamily: "Poppins_600SemiBold",
  },
});

export default Login;