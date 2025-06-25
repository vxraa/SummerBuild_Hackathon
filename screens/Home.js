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
import { getTripsByUserId, getBudgetByTripId, setBudgetByTripId } from "../api/tripsAPI";
import { fetchUserData } from "../api/authAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavBar from "../components/NavBar";

const { width, height } = Dimensions.get("window");

export default function Home() {
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(-1);

  const remaining = budget - spent;

  useEffect(() => {
    const initialize = async () => {
      try {
        let storedUserData = await AsyncStorage.getItem("userData");
        if (!storedUserData) {
          storedUserData = await fetchUserData();
          await AsyncStorage.setItem("userData", JSON.stringify(storedUserData));
        }
        const userData = JSON.parse(storedUserData);
        setUserId(userData.id);

        const tripsData = await getTripsByUserId(userData.id);
        if (tripsData.length > 0) {
          setSelectedTripId(tripsData[0].id);
          const fetchedBudget = await getBudgetByTripId(tripsData[0].id);
          setBudget(fetchedBudget);

          // Replace this with real API if available
          const expenses = await fetch(`/api/trips/${tripsData[0].id}/expenses`).then(res => res.json());
          const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
          setSpent(totalSpent);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initialize();
  }, []);

  const handleSetBudget = async (newBudget) => {
    try {
      if (selectedTripId !== -1) {
        await setBudgetByTripId(selectedTripId, newBudget);
        setBudget(newBudget);
      }
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
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3C1F",
  },
  bell: {
    fontSize: 18,
  },
  budgetCard: {
    backgroundColor: "#1E3C1F",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFF",
  },
  setBudgetButton: {
    backgroundColor: "#FFDF78",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  setBudgetText: {
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    color: "#3A4646",
  },
  remaining: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    color: "#FFF",
    marginTop: 6,
  },
  detail: {
    fontSize: 14,
    color: "#FFF",
    marginTop: 4,
    fontFamily: "Poppins-Medium",
  },
  rowDetails: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  marginTop: 4,
},

  progressBar: {
    marginTop: 10,
  },
  month: {
    marginTop: 10,
    fontSize: 16,
    color: "#FFF",
    fontFamily: "Poppins-Bold",
  },
  goalSection: {
    marginTop: 30,
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
  },
  goalText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
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
