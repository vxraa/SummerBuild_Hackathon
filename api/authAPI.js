// Import BASE_URL from config
import BASE_URL from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// Function to login using fetch
export const loginUser = async (email, password) => {
  try {
    // Prepare the data object to be sent in the body
    const data = {
      email: email,
      password: password,
    };

    // Send the POST request using fetch
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Send the email and password as JSON
    });

    // Parse the response
    const result = await response.json();

    // Store the JWT token in AsyncStorage
    await AsyncStorage.setItem("token", result.token);

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }
    console.log("Login successful:", result);
    return result;
  } catch (error) {
    throw new Error("An error occurred during login. Please try again.");
  }
};

export const signup = async (firstname, lastname, email, password) => {
  try {
    // Prepare the data to send in the POST request
    const data = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password,
    };

    // Send the POST request to the API
    const response = await fetch(`${BASE_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // Store the JWT token in AsyncStorage
    await AsyncStorage.setItem("token", result.token);

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }
    console.log("Registration successful:", result);
    return result;
  } catch (error) {
    throw new Error("An error occurred during registration. Please try again.");
  }
};

export const updateProfile = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  gender,
  dob
) => {
  try {
    // Prepare the data to send in the request
    const payload = {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dob,
    };

    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    // Send the POST request to the API with the payload
    const response = await fetch(`${BASE_URL}/api/update-profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Convert the payload to a JSON string
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update profile failed");
    }

    const result = await response.json();

    console.log("Update profile successful:", result);
    return result.user;
  } catch (error) {
    console.error("Error updating profile:", error.message);
    throw new Error("An error occurred during update. Please try again.");
  }
};

// Function to logout and remove JWT token from storage
export const logoutUser = async () => {
  try {
    // await AsyncStorage.removeItem("token");
    await AsyncStorage.clear();
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Error during logout: ", error.message);
  }
};

// Helper function to check if the JWT token is expired
export const isTokenExpired = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return true; // If no token is found, treat as expired

    // Decode the token to get the payload
    const decodedToken = jwtDecode(token);

    // Get current time in seconds (JWT `exp` is also in seconds)
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token: ", error);
    return true; // If an error occurs, consider the token expired
  }
};

export const fetchUserData = async () => {
  try {
    // Get the JWT token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    // Send request with JWT token in headers
    const response = await fetch(`${BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await response.json();

    return userData.user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
