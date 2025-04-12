import React, { createContext, useContext, useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import { lightTheme } from "@/constants/Colors";
import { darkTheme } from "@/constants/Colors";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const scale = useSharedValue(1);

  const toggleTheme = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
    setTimeout(() => {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, 100);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderRadius: 20,
      overflow: "hidden",
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scale.value, [0.95, 1], [1, 0]),
    };
  });

  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <AnimatedBlurView
          pointerEvents="none"
          intensity={60}
          style={[
            StyleSheet.absoluteFillObject,
            { zIndex: 1 },
            animatedBlurStyle,
          ]}
          tint={theme === "dark" ? "dark" : "light"}
        />
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          {children}
        </Animated.View>
      </ThemeContext.Provider>
    </View>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
