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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
import { useFonts, Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateEmail } from "../utils/authUtil";
import { loginUser } from "../api/authAPI";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
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
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        enableAutomaticScroll={true}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Login</Text>
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="JohnDoe@gmail.com"
          />

          <PasswordField 
            label="Password" 
            value={password} 
            onChangeText={setPassword}
            placeholder="Enter your password"
          />

          <Button
            title="Log in"
            onPress={handleLogin}
            backgroundColor="#006D77"
            textColor="#FFFFFF"
            paddingVertical={15}
            borderRadius={5}
            width="100%"
          />

          <View style={styles.registrationContainer}>
            <Text style={styles.registrationText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Register Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  header: {
    fontSize: 32,
    color: "#006D77",
    fontFamily: "Nunito_700Bold",
  },
  formContainer: {
    width: "100%",
  },
  registrationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registrationText: {
    fontSize: 14,
    color: "#333333",
    fontFamily: "Nunito_400Regular",
  },
  registerLink: {
    fontSize: 14,
    color: "#006D77",
    fontFamily: "Nunito_700Bold",
  },
});

export default Login;