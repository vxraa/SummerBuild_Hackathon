import "react-native-gesture-handler"; // Ensure this is at the very top
import React from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens"; // <-- Enables screen optimization

// Screens
import StartPage from "./screens/StartPage";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import Scanner from "./screens/Scanner";
import Expenses from "./screens/Expenses";
import Account from "./screens/Account";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";


enableScreens(); 

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartPage">

          <Stack.Screen
            name="StartPage"
            component={StartPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Scanner"
            component={Scanner}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Expenses"
            component={Expenses}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              headerShown: false,
            }}
          />
          
          
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});