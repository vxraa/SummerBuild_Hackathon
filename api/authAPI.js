import { BASE_URL } from "../config"; // Now this will resolve correctly
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (email, password) => {
  try {
    const data = {
      email: email,
      password: password,
    };

    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    await AsyncStorage.setItem("token", result.token);

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }
    return result;
  } catch (error) {
    throw new Error("An error occurred during login. Please try again.");
  }
};