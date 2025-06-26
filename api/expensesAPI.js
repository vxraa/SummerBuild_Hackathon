import BASE_URL from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";




export const addExpense = async (expenseData) => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log("expenseDataId",expenseData.user_id)
    const url = `${BASE_URL}/api/users/${expenseData.user_id}/expenses`;
    
    // Prepare the payload with consistent field names
    const payload = {
      vendor: expenseData.vendor || expenseData.name, // Handle both cases
      total: expenseData.total || expenseData.amount,
      date: expenseData.date,
      category: expenseData.category
    };

    console.log("Sending to backend:", payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    
    // First try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON:", responseText);
      throw new Error(`Server returned: ${responseText.substring(0, 100)}...`);
    }

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error("Full API error:", {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const getExpensesByUserId = async (userId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/users/${userId}/expenses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/expenses/${expenseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete expense");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};
