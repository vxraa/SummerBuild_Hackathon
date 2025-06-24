// Import necessary modules
import BASE_URL from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const addExpense = async (expenseData) => {
  try {
    // Get the JWT token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/add-expenses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData), // Send the expense data as JSON
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add expense");
    }

    console.log("Expense added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw new Error(
      "An error occurred while adding the expense. Please try again."
    );
  }
};

export const fetchExpenses = async (userId) => {
  try {
    // Get the JWT token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/get-expenses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Attempt to parse error details if available
      throw new Error(
        `Failed to fetch expenses: ${errorData?.message || response.status}`
      );
    }

    const result = await response.json();

    // Verify structure: ensure `result.message` is an array before returning
    if (!Array.isArray(result.message)) {
      throw new Error("Unexpected response format: expenses data is not an array.");
    }

    console.log("Fetched expenses:", result.message); // Log only the array if it's correct
    return result.message; // Return only the message (array of expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw new Error(
      error.message || "An error occurred while fetching expenses. Please try again."
    );
  }
};

export const deleteExpense = async (expenseId) => {
  console.log("expenseId:", expenseId);
  try {
    // Get the JWT token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("User is not authenticated");
    }

    // Construct the delete URL with the expenseId
    const response = await fetch(`${BASE_URL}/api/delete-expense/${expenseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Parse the response
    const result = await response.json();

    // Check for errors from the server
    if (!response.ok) {
      throw new Error(result.message || "Failed to delete expense");
    }

    console.log("Expense deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error(
      "An error occurred while deleting the expense. Please try again."
    );
  }
};


// expensesAPI.js
export const getExpensesByTripId = async (tripId) => {
  try {
    const url = `${BASE_URL}/api/get-expenses/trip/${tripId}`; // Adjust BASE_URL to your API base URL

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const expenses = await response.json();
    return expenses.data; // Return the expenses data
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw new Error("An error occurred while fetching expenses. Please try again.");
  }
};
