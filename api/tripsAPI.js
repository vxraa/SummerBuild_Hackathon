import BASE_URL from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

// User Budget Functions
export const getBudgetByUserId = async (userId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/users/${userId}/budget`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch budget");
    }

    const { budget } = await response.json();
    return budget || 0;
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
};

export const setBudgetByUserId = async (userId, budget) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/users/${userId}/budget`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ budget }),
    });

    if (!response.ok) {
      throw new Error("Failed to set budget");
    }

    return await response.json();
  } catch (error) {
    console.error("Error setting budget:", error);
    throw error;
  }
};

