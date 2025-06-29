import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import * as Progress from "react-native-progress";
import SetBudgetModal from "./SetBudgetModal";
import { getBudgetByUserId, setBudgetByUserId } from "../api/tripsAPI";
import { fetchUserData } from "../api/authAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExpensesByUserId } from "../api/expensesAPI";
import NavBar from "../components/NavBar";

const { width, height } = Dimensions.get("window");

export default function Home() {
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  const remaining = budget - spent;

  useEffect(() => {
    const initialize = async () => {
      try {
        let storedUserData = await AsyncStorage.getItem("userData");
        console.log("Raw storedUserData:", storedUserData);
        const userData = JSON.parse(storedUserData);
        console.log("userdata:", userData);        

        if (!storedUserData) {
          storedUserData = await fetchUserData();
          console.log("Raw storedUserData:", storedUserData);
          const userData = JSON.parse(storedUserData);
          console.log("Parsed user ID:", userData.id || userData?.user?.id);

          try {
            const fetchedBudget = await getBudgetByUserId(userData.id || userData?.user?.id);
            console.log("Fetched budget:", fetchedBudget);
            setBudget(fetchedBudget);
          } catch (e) {
            console.log("Budget fetch failed", e);
          }

          try {
            const expenses = await getExpensesByUserId(userData.id || userData?.user?.id);
            console.log("Fetched expenses:", expenses);
            const totalSpent = expenses.reduce((sum, exp) => sum + exp.total, 0);
            setSpent(totalSpent);
          } catch (e) {
            console.log("Expense fetch failed", e);
          }
          await AsyncStorage.setItem("userData", JSON.stringify(storedUserData));
        }

        const userId = userData.user?.id || userData.id;
        if (!userId) throw new Error("User ID not found");
        setUserId(userId);

        const fetchedBudget = await getBudgetByUserId(userId);
        console.log("Fetched budget:", fetchedBudget);
        setBudget(fetchedBudget);

        const expenses = await getExpensesByUserId(userId);
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.total, 0) || 0;
        setSpent(totalSpent);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initialize();
  }, []);

  const handleSetBudget = async (newBudget) => {
    console.log("newbudget:", newBudget);
    try {
      await setBudgetByUserId(userId, newBudget);
      setBudget(newBudget);
    } catch (error) {
      console.error("Set budget error:", error);
    } finally {
      setBudgetModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.welcome}>Welcome Back</Text>
          <TouchableOpacity>
            <Text style={styles.bell}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Monthly Budget</Text>
            <TouchableOpacity
              onPress={() => setBudgetModalVisible(true)}
              style={styles.setBudgetButton}
            >
              <Text style={styles.setBudgetText}>➕ Set Budget</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.remaining}>${remaining.toLocaleString()} Remaining</Text>
          <View style={styles.rowDetails}>
          <Text style={styles.detail}>Budget: ${budget.toLocaleString()}</Text>
          <Text style={styles.detail}>Spent: ${spent.toLocaleString()}</Text>
        </View>

          <Progress.Bar
            progress={budget > 0 ? spent / budget : 0}
            width={width * 0.8}
            color="#FFDF78"
            unfilledColor="#E4E4E4"
            borderWidth={0}
            height={8}
            style={styles.progressBar}
          />
          <Text style={styles.month}>June</Text>
        </View>

        <View style={styles.goalSection}>
          <Text style={styles.goalTitle}>Your Personal Goal</Text>
          <View style={styles.goalCard}>
            <Text style={styles.goalText}>
              Save up enough money to buy a new laptop for university!
            </Text>
          </View>
        </View>

        <Image
          source={require("../assets/images/CardStack.png")}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </ScrollView>

      <SetBudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        onSetBudget={handleSetBudget}
      />

      {/* Fixed Bottom Nav */}
      <View style={styles.navBarContainer}>
        <NavBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 15,
  },
  scrollContent: {
    paddingTop: height * 0.06,
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%', // Ensure full width
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3C1F",
    flexShrink: 1, // Allow text to shrink if needed
  },
  bell: {
    fontSize: 18,
    marginLeft: 10, // Add some spacing
  },
  budgetCard: {
    backgroundColor: "#1E3C1F",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    width: '100%', // Ensure full width
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%', // Ensure full width
  },
  budgetTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFF",
    flexShrink: 1, // Allow text to shrink
    marginRight: 10, // Add spacing between elements
  },
  setBudgetButton: {
    backgroundColor: "#FFDF78",
    paddingHorizontal: 12, // Increased padding
    paddingVertical: 6,
    borderRadius: 100,
    minWidth: 100, // Ensure minimum width
  },
  setBudgetText: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: "#3A4646",
    textAlign: 'center', // Center text
  },
  remaining: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    color: "#FFF",
    marginTop: 6,
    width: '100%', // Ensure full width
  },
  rowDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  detail: {
    fontSize: 14,
    color: "#FFF",
    fontFamily: "Poppins-Medium",
    flexShrink: 1, // Allow text to shrink
    maxWidth: '48%', // Prevent taking full width
  },
  progressBar: {
    marginTop: 10,
    width: '100%', // Ensure full width
  },
  month: {
    marginTop: 10,
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Poppins-Bold",
    width: '100%', // Ensure full width
  },
  goalSection: {
  marginTop: 30,
  width: '100%',
},
goalTitle: {
  fontSize: 18,
  color: "#1E3C1F",
  fontFamily: "Poppins-SemiBold",
  marginBottom: 10,
},
goalCard: {
  backgroundColor: "#1E3C1F",
  borderRadius: 15,
  padding: 15,
  width: '100%',
  // Remove fixed height & allow natural expansion
  alignSelf: 'flex-start', // Prevents width compression
},
goalText: {
  color: "#FFF",
  fontSize: 16,
  fontFamily: "Poppins-Medium",
  flexWrap: 'wrap', // Allows text to wrap
  width: '100%',   // Takes full container width
  // Optional: Better text spacing
  lineHeight: 22,  // Improves readability
},
  cardImage: {
    width: width * 0.9,
    height: height * 0.4,
    alignSelf: "center",
    marginTop: 20,
  },
  navBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});