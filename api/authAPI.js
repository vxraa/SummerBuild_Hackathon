import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Login Function
export const loginUser = async (email, password) => {
  try {
    const data = { email, password };

    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    // Optional: Save entire user object instead of token
    await AsyncStorage.setItem("userData", JSON.stringify(result));
    console.log("userData", result);

    return result;
  } catch (error) {
    throw new Error("An error occurred during login. Please try again.");
  }
};

// Register Function
export const registerUser = async (firstname, lastname, email, password) => {
  try {
    const data = { firstname, lastname, email, password };

    const response = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.message || JSON.stringify(result) || "Registration failed";
      throw new Error(errorMessage);
    }

    // Optional: Save registered user data to local storage
    await AsyncStorage.setItem("userData", JSON.stringify(result));

    return result;
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    throw error; // Let frontend handle it
  }
};

export const getUserIdFromStorage = async () => {
  const stored = await AsyncStorage.getItem('userData');
  const data = JSON.parse(stored);
  return data?.user?.id;
};