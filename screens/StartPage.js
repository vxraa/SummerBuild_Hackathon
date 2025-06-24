import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
  Dimensions,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import CardStack from "../assets/images/CardStack.png";
import Arrows from "../assets/icons/Arrows.png";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";

// Prevent auto-hide
SplashScreen.preventAutoHideAsync();

const StartPage = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  const [unlocked, setUnlocked] = useState(false);
  const navigation = useNavigation();
  const pan = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.9)).current;
   const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const thumbSize = 52;
  const trackWidth = screenWidth * 0.75;
  const maxSlide = trackWidth - thumbSize - 4;

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    if (unlocked) {
      navigation.navigate("Expenses");
    }
  }, [unlocked]);

  useEffect(() => {
    const pulse = Animated.loop(
        Animated.sequence([
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
            }),
            Animated.timing(pulseAnim, {
                toValue: 0.9,
                duration: 800,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
            }),
        ])
    );

    pulseRef.current = pulse;
    pulse.start();

    return () => {
        pulseRef.current?.stop();
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pulseRef.current?.stop();
        pulseAnim.setValue(1);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= maxSlide) {
          pan.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > maxSlide - 20) {
          Animated.timing(pan, {
            toValue: maxSlide,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            navigation.navigate("Expenses");
          });
          
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
          }).start(() => {
            pulseRef.current?.start();
          });
        }
      },
    })
  ).current;

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>

        <Image source={CardStack} style={styles.image} resizeMode="contain" />

        <View style={[styles.contentWrapper, { width: trackWidth }]}>
            <Text style={styles.subtitle}>Spend Smarter.</Text>
            <Text style={styles.title}>Live Better.</Text>
        

            <View style={[styles.sliderTrack, { width: trackWidth }]}>
                <Animated.View
                    style={[
                        styles.sliderFill,
                        {
                            width: pan.interpolate({
                                inputRange: [0, maxSlide],
                                outputRange: [0, trackWidth - 4],
                                extrapolate: "clamp",
                            }),
                        },
                    ]}
                />

                <Animated.Text
                    style={[
                        styles.sliderLabel,
                        {
                            opacity: pan.interpolate({
                                inputRange: [0, maxSlide * 0.6],
                                outputRange: [1, 0],
                                extrapolate: "clamp",
                            }),
                        },
                    ]}
                >
                    Let's Budget
                </Animated.Text>
                
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                            styles.sliderThumb, 
                            { 
                                transform: [
                                    { translateX: pan },
                                    { scale: pulseAnim },
                                ],
                            },
                        ]}
                >
                    <Image source={Arrows} style={styles.thumbIcon} resizeMode="contain" />
                </Animated.View>
            </View>
        </View>
    </SafeAreaView>
  );
};

export default StartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e3c1f",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 350,
    height: 450,
  },
  contentWrapper: {
    alignItems: "flex-start",
  },
  subtitle: {
    fontFamily: "Poppins_700Bold",
    color: "#ccc",
    fontSize: 24,
  },
  title: {
    fontFamily: "Poppins_800ExtraBold",
    color: "#fff",
    fontSize: 32,
    marginTop: 4,
    marginBottom: 31,
  },
  sliderTrack: {
    height: 57,
    backgroundColor: "#fcd15a",
    borderRadius: 30,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  sliderFill: {
    position: "absolute",
    height: 52,
    top: 2.5,
    left: 2,
    backgroundColor: "#1e3c1f",
    borderRadius: 26,
    zIndex: 0,
  },
  sliderLabel: {
    position: "absolute",
    alignSelf: "center",
    color: "#1e3c1f",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    zIndex: 1,
  },
  sliderThumb: {
    width: 52,
    height: 52,
    borderRadius: 25,
    backgroundColor: "#1e3c1f",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    marginLeft: 2,
  },
  thumbText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  thumbIcon: {
    width: 24,
    height: 12,
  }
});
