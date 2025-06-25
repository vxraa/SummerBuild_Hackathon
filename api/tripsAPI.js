import BASE_URL from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";



// User Budget Functions
export const getBudgetByUserId = async (userId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const url = `${BASE_URL}/api/users/${userId}/budget`;
    
    console.log("Attempting fetch to:", url); // Log the exact URL
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Full error response:", errorData);
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log("data:",data);
    return data || 0;
  } catch (error) {
    console.error("Full fetch error:", error);
    throw error;
  }
};

export const setBudgetByUserId = async (userId, budget) => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log("tokenforbudget:", token);
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

    console.log("response for budget:", response);

    if (!response.ok) {
      throw new Error("Failed to set budget");
    }

    return await response.json();
  } catch (error) {
    console.error("Error setting budget:", error);
    throw error;
  }
};

