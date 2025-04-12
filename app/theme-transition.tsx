import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  useAnimatedRef,
  interpolate,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useThemeContext } from "./theme-context";
import { lightTheme } from "@/constants/Colors";
import { darkTheme } from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_HEIGHT = 350;

export default function ThemeTransition() {
  const { theme, toggleTheme } = useThemeContext();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const buttonScale = useSharedValue(1);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useScrollViewOffset(scrollRef);

  const handleThemeChange = () => {
    // Animate button
    buttonScale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );

    toggleTheme();
  };

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const animatedWrapperStyle = useAnimatedStyle(() => {
    return {
      marginHorizontal: interpolate(
        scrollY.value,
        [HEADER_HEIGHT, 0, -HEADER_HEIGHT],
        [0, 0, 20]
      ),
      borderRadius: interpolate(
        scrollY.value,
        [HEADER_HEIGHT, 0, -HEADER_HEIGHT],
        [0, 0, 40]
      ),
      overflow: "hidden",
    };
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.text }]}>
          Lifestyle
        </Text>
        <Animated.View style={[styles.themeButton, buttonStyle]}>
          <Pressable
            onPress={handleThemeChange}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: currentTheme.primary },
            ]}
          >
            <Text style={styles.buttonText}>
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        style={[styles.container, { backgroundColor: currentTheme.background }]}
        bounces={true}
      >
        <Animated.View style={animatedWrapperStyle}>
          <Animated.View
            style={[
              {
                height: HEADER_HEIGHT,
                overflow: "hidden",
              },
              animatedHeaderStyle,
            ]}
          >
            <Animated.Image
              source={require("../assets/images/porsche.jpeg")}
              style={styles.image}
            />
          </Animated.View>
        </Animated.View>
        <View
          style={[styles.content, { backgroundColor: currentTheme.background }]}
        >
          <Text style={[styles.heading, { color: currentTheme.text }]}>
            The Art of Performance
          </Text>

          <Text style={[styles.paragraph, { color: currentTheme.text }]}>
            Experience the perfect blend of luxury and performance with the
            Porsche 992 Turbo S. This masterpiece of engineering represents the
            pinnacle of automotive excellence, where every detail has been
            crafted to enhance the driving experience.
          </Text>

          <View style={styles.specsContainer}>
            <View
              style={[styles.specItem, { backgroundColor: currentTheme.card }]}
            >
              <Text style={[styles.specValue, { color: currentTheme.primary }]}>
                650 HP
              </Text>
              <Text style={[styles.specLabel, { color: currentTheme.text }]}>
                Power
              </Text>
            </View>
            <View
              style={[styles.specItem, { backgroundColor: currentTheme.card }]}
            >
              <Text style={[styles.specValue, { color: currentTheme.primary }]}>
                2.7s
              </Text>
              <Text style={[styles.specLabel, { color: currentTheme.text }]}>
                0-60 mph
              </Text>
            </View>
            <View
              style={[styles.specItem, { backgroundColor: currentTheme.card }]}
            >
              <Text style={[styles.specValue, { color: currentTheme.primary }]}>
                205 mph
              </Text>
              <Text style={[styles.specLabel, { color: currentTheme.text }]}>
                Top Speed
              </Text>
            </View>
          </View>

          <Text style={[styles.paragraph, { color: currentTheme.text }]}>
            The 992 Turbo S is more than just a car; it's a statement of intent.
            With its 3.8-liter twin-turbocharged flat-six engine producing 650
            horsepower and 590 lb-ft of torque, all-wheel drive system, and
            precision engineering, it represents the perfect harmony between
            form and function. The latest generation features enhanced
            aerodynamics with active elements, an 8-speed PDK transmission, and
            a sophisticated chassis that delivers unprecedented performance and
            driving dynamics.
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    position: "absolute",
    zIndex: 1,
    width: SCREEN_WIDTH,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  themeButton: {
    marginLeft: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  specsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  specItem: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  specValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  specLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
});
