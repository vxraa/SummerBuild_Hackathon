import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import SetBudgetModal from "./SetBudgetModal";
import AddExpenseModal from "./AddExpenseModal";
import * as Progress from "react-native-progress";
import RoundedSquareIcon from "../components/RoundedSquareIcon";
import Toast from "react-native-toast-message";
import { addExpense, deleteExpense, getExpensesByUserId } from "../api/expensesAPI";
import { fetchUserData } from "../api/authAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart } from "react-native-chart-kit";
import { getBudgetByUserId, setBudgetByUserId } from "../api/tripsAPI";
import { Swipeable } from "react-native-gesture-handler";
import NavBar from "../components/NavBar";

const iconData = [
  {
    id: "shopping",
    iconName: "cart",
    backgroundColor: "#EEF4F8",
    iconColor: "#81B2CA",
    label: "Shopping",
  },
  {
    id: "lodging",
    iconName: "home",
    backgroundColor: "#faeee6",
    iconColor: "#c46d33",
    label: "Lodging",
  },
  {
    id: "food",
    iconName: "restaurant",
    backgroundColor: "#EEEBED",
    iconColor: "#836F81",
    label: "Food",
  },
  {
    id: "transport",
    iconName: "bus",
    backgroundColor: "#E5EEED",
    iconColor: "#42887B",
    label: "Transport",
  },
  {
    id: "activities",
    iconName: "color-palette",
    backgroundColor: "#f5e4ef",
    iconColor: "#c957a5",
    label: "Activities",
  },
  {
    id: "health",
    iconName: "medkit",
    backgroundColor: "#faf6e1",
    iconColor: "#e3bc0e",
    label: "Health",
  },
  {
    id: "souvenirs",
    iconName: "gift",
    backgroundColor: "#f5e1e3",
    iconColor: "#c95762",
    label: "Souvenirs",
  },
  {
    id: "others",
    iconName: "albums",
    backgroundColor: "#e6fae7",
    iconColor: "#418743",
    label: "Others",
  },
];

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Expenses = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        let storedUserData = await AsyncStorage.getItem("userData");
        if (!storedUserData) {
          storedUserData = await fetchUserData();
          await AsyncStorage.setItem("userData", JSON.stringify(storedUserData));
        }
        const userData = JSON.parse(storedUserData);
        const userId = userData.user?.id || userData.id;
        if (!userId) throw new Error("User ID not found");
        setUserId(userId);

        const [userBudget, userExpenses] = await Promise.all([
          getBudgetByUserId(userId),
          getExpensesByUserId(userId)
        ]);

        setBudget(userBudget);
        setExpenses(userExpenses);
        setTotalSpent(userExpenses.reduce((sum, exp) => sum + exp.amount, 0));
        updatePieChartData(userExpenses);
      } catch (error) {
        console.error("Initialization error:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load data",
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const updatePieChartData = (expenses) => {
    const categoryTotals = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    const pieData = Object.entries(categoryTotals).map(([name, population], index) => ({
      name,
      population,
      color: `hsl(${index * 45}, 70%, 50%)`,
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }));

    setPieChartData(pieData);
  };

  const handleAddExpense = async (expense) => {
    try {
      const newExpense = await addExpense({ ...expense, user_id: userId });
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      setTotalSpent(totalSpent + newExpense.amount);
      updatePieChartData(updatedExpenses);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Expense added successfully",
      });
      return newExpense;
    } catch (error) {
      console.error("Error adding expense:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add expense",
      });
      throw error;
    }
  };

  const handleSetBudget = async (newBudget) => {
    try {
      await setBudgetByUserId(userId, newBudget);
      setBudget(newBudget);
      Toast.show({
        type: "success",
        text1: "Budget Updated",
        text2: "Your budget has been updated successfully"
      });
    } catch (error) {
      console.error("Error setting budget:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update budget"
      });
    } finally {
      setBudgetModalVisible(false);
    }
  };

  const getIconForCategory = (category) => {
    const icon = iconData.find(
      (item) => item.label.toLowerCase() === category.toLowerCase()
    );
    return icon || {
      iconName: "cash-outline",
      backgroundColor: "#e6fae7",
      iconColor: "#418743",
    };
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteContainer}
      onPress={() => handleDeleteExpense(id)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      const updatedExpenses = expenses.filter((exp) => exp.id !== id);
      setExpenses(updatedExpenses);
      setTotalSpent(updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0));
      updatePieChartData(updatedExpenses);
      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: "Expense removed successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete expense",
      });
    }
  };

  const toggleSummary = () => {
    setSummaryVisible(!summaryVisible);
  };

  const progress = budget ? totalSpent / budget : 0;

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3C1F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Manage Your Budget</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.budgetContainer}>
          <Text style={styles.amount}>SGD {totalSpent.toFixed(2)}</Text>
          
          {budget === 0 ? (
            <TouchableOpacity
              style={styles.setBudgetButton}
              onPress={() => setBudgetModalVisible(true)}
            >
              <Text style={styles.setBudgetText}>Set a Budget</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.budgetInfo}>
              <Progress.Bar
                progress={progress}
                width={screenWidth * 0.8}
                color="#F47966"
                unfilledColor="#61A4AB"
                height={screenHeight * 0.01}
                borderWidth={0}
              />
              <Text style={styles.budgetText}>BUDGET: SGD {budget.toFixed(2)}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.viewSummaryButton}
            onPress={toggleSummary}
          >
            <Text style={styles.viewSummaryText}>
              {summaryVisible ? "Hide Summary" : "View Summary"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.expensesContainer}>
          <Text style={styles.expensesHeader}>Your Expenses</Text>
          <Text style={styles.sortText}>Sort: Date (oldest first) →</Text>
          
          {expenses.length === 0 ? (
            <Text style={styles.noExpenses}>
              You haven't added any expenses yet.
            </Text>
          ) : (
            <ScrollView style={styles.expensesList}>
              {expenses.map((expense) => {
                const { iconName, backgroundColor, iconColor } =
                  getIconForCategory(expense.category);

                return (
                  <Swipeable
                    key={expense.id}
                    renderRightActions={() => renderRightActions(expense.id)}
                  >
                    <View style={styles.expenseCard}>
                      <RoundedSquareIcon
                        iconName={iconName}
                        iconSize={screenHeight * 0.03}
                        iconColor={iconColor}
                        backgroundColor={backgroundColor}
                        size={screenHeight * 0.07}
                      />
                      <View style={styles.expenseDetails}>
                        <Text style={styles.expenseCategory}>
                          {expense.category}
                        </Text>
                        <Text style={styles.expenseAmount}>
                          SGD {expense.amount.toFixed(2)}
                        </Text>
                        <Text style={styles.expenseTitle}>{expense.name}</Text>
                        <Text style={styles.expenseDate}>
                          {new Date(expense.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </Swipeable>
                );
              })}
            </ScrollView>
          )}

          <TouchableOpacity 
            style={styles.addExpenseButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addExpenseText}>+ Add Expense</Text>
          </TouchableOpacity>
        </View>
      </View>

      {summaryVisible && (
        <View style={styles.pieChartContainer}>
          <PieChart
            data={pieChartData}
            width={screenWidth * 0.85}
            height={screenWidth * 0.5}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            absolute
          />
        </View>
      )}

      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddExpense}
        userId={userId}
      />

      <SetBudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        onSetBudget={handleSetBudget}
      />

      <NavBar />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: screenHeight * 0.05,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    marginTop: 26,
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: "#333",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  budgetContainer: {
    backgroundColor: "#1E3C1F",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  amount: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    color: "#FFF",
    marginBottom: 10,
  },
  setBudgetButton: {
    marginVertical: 10,
  },
  setBudgetText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#FFF",
  },
  budgetInfo: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  budgetText: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#FFF",
    marginTop: 10,
  },
  viewSummaryButton: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  viewSummaryText: {
    fontSize: 12,
    fontFamily: "Poppins_700Bold",
    color: "#FFF",
  },
  expensesContainer: {
    flex: 1,
  },
  expensesHeader: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#333",
    marginBottom: 5,
  },
  sortText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    marginBottom: 15,
  },
  noExpenses: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  expensesList: {
    flex: 1,
  },
  expenseCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  expenseDetails: {
    flex: 1,
    marginLeft: 15,
  },
  expenseCategory: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#333",
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#333",
    textAlign: "right",
  },
  expenseTitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    marginTop: 5,
  },
  expenseDate: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    textAlign: "right",
  },
  addExpenseButton: {
    backgroundColor: "#FFDF78",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 5,
    alignSelf: 'center',
    width: '50%',
    alignItems: "center",
    marginTop: 20,
  },
  addExpenseText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#3A4646",
  },
  pieChartContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  deleteContainer: {
    backgroundColor: "#F47966",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "80%",
    borderRadius: 10,
    marginTop: 10,
  },
  deleteText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
});

export default Expenses;