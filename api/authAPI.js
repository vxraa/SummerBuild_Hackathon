import  BASE_URL  from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Login Function
export const loginUser = async (email, password) => {
  try {
    const data = { email, password };
    const url = `${BASE_URL}/api/login`;
    
    console.log("Attempting fetch to:", url); // Log the exact URL

    const response = await fetch(url, {
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
    await AsyncStorage.setItem("token", result.token);
    console.log("Stored token:", result.token);
    await AsyncStorage.setItem("userData", JSON.stringify(result.user));
    console.log("userData", result);

    return result;
  } catch (error) {
    throw new Error("An error occurred during login. Please try again.");
  }
};

export const registerUser = async (firstname, lastname, email, password) => {
  try {
    const data = { firstname, lastname, email, password };
    console.log("dataforregiste:", data)

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

//updateProfile
export const updateProfile = async (
  firstname,
  lastname,
  email,
  phone,
  gender,
  dob
) => {
  try {
    // Get user data and token from AsyncStorage
    const userDataString = await AsyncStorage.getItem("userData");
    console.log("getUserDataForUpdate", userDataString);
    if (!userDataString) throw new Error("No userData in storage");

    const userData = JSON.parse(userDataString);
    const userId = userData?.user?.id || userData?.id;
    const token = await AsyncStorage.getItem("token");
    console.log("userId:", userId)

    if (!userId || !token) throw new Error("Missing user ID or token");

    // Prepare the request body
    const requestBody = {
      firstname,
      lastname,
      email,
      phone,
      gender,
      dob,
    };

    console.log("requestbodyforupdate: ", requestBody);

    // Make the API call to update profile
    const response = await fetch(`${BASE_URL}/api/user/${userId}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    // First get the response text to handle non-JSON responses
    const responseText = await response.text();
    console.log("responseText: ", responseText)
    
    try {
      const responseData = responseText ? JSON.parse(responseText) : {};
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update profile");
      }

      // Return the updated user data
      return responseData;
    } catch (parseError) {
      // If JSON parsing fails, but response was ok, throw the original text
      if (response.ok) {
        throw new Error("Invalid response format");
      }
      // If not OK and not JSON, throw the raw response
      throw new Error(responseText || "Failed to update profile");
    }
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Helper function to update user data in AsyncStorage
export const updateUserDataInAsyncStorage = async (userData) => {
  try {
    const currentUserDataString = await AsyncStorage.getItem("userData");
    if (!currentUserDataString) return;

    const currentUserData = JSON.parse(currentUserDataString);
    const updatedUserData = {
      ...currentUserData,
      user: {
        ...currentUserData.user,
        ...userData, // Merge the updated fields
      },
    };

    await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
  } catch (error) {
    console.error("Error updating user data in AsyncStorage:", error);
    throw error;
  }
};

export const fetchUserData = async () => {
  const userDataString = await AsyncStorage.getItem("userData");
  if (!userDataString) throw new Error("No userData in storage");
  console.log("userDataString", userDataString)

  const userData = JSON.parse(userDataString);
  const userId = userData?.user?.id || userData?.id;
  const token = await AsyncStorage.getItem("token");
  console.log("tokenforfetch:", token)

  if (!userId || !token) throw new Error("Missing user ID or token");

  const response = await fetch(`${BASE_URL}/api/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch user data");

  return await response.json();
};

export const getUserIdFromStorage = async () => {
  const stored = await AsyncStorage.getItem('userData');
  const data = JSON.parse(stored);
  return data?.user?.id;
};