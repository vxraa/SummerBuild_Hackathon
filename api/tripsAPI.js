import BASE_URL from "../config";

export const deleteTripById = async (tripId) => {
  try {
    console.log("tripid: ", tripId);
    const deleteUrl = `${BASE_URL}/api/trips/${tripId}`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete the trip");
    }

    console.log("Trip deleted successfully:", tripId);
    return true; // Indicate success
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw new Error(
      "An error occurred while deleting the trip. Please try again."
    );
  }
};

export const getTripsByUserId = async (userId) => {
  try {
    const url = `${BASE_URL}/api/users/${userId}/trips`; // Adjust based on your API structure

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trips");
    }

    const trips = await response.json();
    return trips; // Return the trips data
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw new Error(
      "An error occurred while fetching trips. Please try again."
    );
  }
};


export const getBudgetByTripId = async (tripId) => {
    try {
      const url = `${BASE_URL}/api/trips/${tripId}/budget`; // Adjust based on your API structure
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch budget");
      }
  
      const { budget } = await response.json(); // Extract budget from response
      return budget; // Return the budget
    } catch (error) {
      console.error("Error fetching budget:", error);
      throw new Error(
        "An error occurred while fetching the budget. Please try again."
      );
    }
  };


  export const setBudgetByTripId = async (tripId, budget) => {
    console.log(tripId, " ", budget);
    try {
      const url = `${BASE_URL}/api/trips/${tripId}/budget`; // Adjust based on your API structure
  
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ budget }), // Send the budget in the request body
      });

      console.log(response);
  
      if (!response.ok) {
        throw new Error("Failed to set budget");
      }
  
      const data = await response.json();
    //   return data; // Return any response data if needed
    } catch (error) {
      console.error("Error setting budget:", error);
      throw new Error(
        "An error occurred while setting the budget. Please try again."
      );
    }
  };
  