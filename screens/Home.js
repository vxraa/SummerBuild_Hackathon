import React from "react";
import { View, Text, StyleSheet } from "react-native";
import NavBar from "../components/NavBar"; 

export default function Home() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to Dashboard!</Text>
      </View>
      <View style={styles.navWrapper}>
        <NavBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
  },
  navWrapper: {
    height: 80, // Same as NavBar height
    overflow: "hidden", // Hide the bottom 18px curve
  },
});
