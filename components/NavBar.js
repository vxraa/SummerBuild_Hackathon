import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeIcon from "../assets/icons/HomeIcon.png";
import BudgetIcon from "../assets/icons/BudgetIcon.png";
import ScannerIcon from "../assets/icons/ScannerIcon.png";
import ProfileIcon from "../assets/icons/ProfileIcon.png";
import SelectedGreen from "../assets/icons/SelectedGreen.png";

const NavBar = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);

  // Position configuration
  const navbarPosition = {
    left: 0,       // X position (0 = far left)
    right: 0,      // Right position (0 = far right)
    bottom: -18,     // Y position from bottom (0 = bottom of screen)
    top: undefined, // Y position from top (undefined = not used)
  };

  // Individual icon dimensions
  const iconDimensions = {
    Home: { width: 28, height: 28 },      // Home icon size
    Expenses: { width: 30, height: 30 },  // Budget icon size
    Scanner: { width: 26, height: 26 },   // Scanner icon size
    Account: { width: 22, height: 25 },   // Profile icon size
  };

  // Navbar container dimensions
  const navbarDimensions = {
    height: 79,
    paddingTop: 20,
    paddingBottom: 10,
  };

  // Selected green background dimensions
  const selectedGreenDimensions = {
    width: 120,
    height: 78,
    bottom: -19.4,
  };

  // Spacing configuration
  const tabSpacing = {
    leftMargin: 60,    // Home icon left margin
    rightMargin: 60,   // Account icon right margin
    betweenSpacing: 0, // Space between middle icons
  };

  // Vertical offset for selected icon
  const selectedIconOffset = -11; 

  const handlePress = (index, screenName) => {
    // Update the active index immediately and force a re-render
    setActiveIndex(index);
    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      navigation.navigate(screenName);
    }, 0);
  };

  return (
    <View style={[
      styles.container, 
      { 
        paddingBottom: insets.bottom,
        height: navbarDimensions.height,
        paddingTop: navbarDimensions.paddingTop,
        // Position styles
        position: 'absolute',
        left: navbarPosition.left,
        right: navbarPosition.right,
        bottom: navbarPosition.bottom,
        top: navbarPosition.top,
      }
    ]}>

      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;

        // Calculate margins for each tab
        let marginStyle = {};
        if (index === 0) { // Home icon
          marginStyle = { marginLeft: tabSpacing.leftMargin };
        } else if (index === tabs.length - 1) { // Account icon
          marginStyle = { marginRight: tabSpacing.rightMargin };
        } else { // Middle icons
          marginStyle = { marginHorizontal: tabSpacing.betweenSpacing / 2 };
        }

        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tabButton, 
              { 
                paddingBottom: navbarDimensions.paddingBottom,
                ...marginStyle,
              }
            ]}
            onPress={() => handlePress(index, tab.screen)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {isActive && (
                <Image 
                  source={SelectedGreen} 
                  style={[
                    styles.selectedGreen, 
                    { 
                      width: selectedGreenDimensions.width, 
                      height: selectedGreenDimensions.height,
                      bottom: selectedGreenDimensions.bottom,
                    }
                  ]} 
                  resizeMode="contain"
                />
              )}
              <Image
                source={tab.icon}
                style={[
                  styles.icon,
                  { 
                    width: iconDimensions[tab.name]?.width || 26, 
                    height: iconDimensions[tab.name]?.height || 26,
                    transform: isActive ? [{ translateY: selectedIconOffset }] : [],
                  },
                  isActive && styles.activeIcon,
                ]}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const tabs = [
  { name: "Home", icon: HomeIcon, screen: "Home" },
  { name: "Expenses", icon: BudgetIcon, screen: "Expenses" },
  { name: "Scanner", icon: ScannerIcon, screen: "Scanner" },
  { name: "Account", icon: ProfileIcon, screen: "Account" },
];

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1f3a1f",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "visible",
    elevation: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "flex-end",
    position: 'relative',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  icon: {
    tintColor: "#fff",
    zIndex: 2,
  },
  activeIcon: {
    tintColor: "#fff",
  },
  reversedIcon: {
    tintColor: "#1f3a1f",
  },
  selectedGreen: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default NavBar;