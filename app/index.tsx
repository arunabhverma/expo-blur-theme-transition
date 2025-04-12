import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  useAnimatedRef,
  interpolate,
  useScrollViewOffset,
  SharedValue,
  Extrapolation,
} from "react-native-reanimated";
import { useThemeContext } from "../components/theme-context";
import { lightTheme } from "@/constants/Colors";
import { darkTheme } from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_HEIGHT = 350;

type Theme = "light" | "dark";
type ThemeColors = typeof lightTheme;

interface HeaderProps {
  title: string;
  onThemeChange: () => void;
  theme: Theme;
  currentTheme: ThemeColors;
  buttonStyle: StyleProp<ViewStyle>;
}

interface SpecItemProps {
  value: string;
  label: string;
  currentTheme: ThemeColors;
}

interface SpecsProps {
  currentTheme: ThemeColors;
}

interface ContentProps {
  currentTheme: ThemeColors;
}

interface AnimatedHeaderProps {
  scrollY: SharedValue<number>;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onThemeChange,
  theme,
  currentTheme,
  buttonStyle,
}) => (
  <View style={styles.header}>
    <Text style={[styles.title, { color: currentTheme.text }]}>{title}</Text>
    <Animated.View style={[styles.themeButton, buttonStyle]}>
      <Pressable
        onPress={onThemeChange}
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
);

const Specs: React.FC<SpecsProps> = ({ currentTheme }) => (
  <View style={styles.specsContainer}>
    <SpecItem value="650 HP" label="Power" currentTheme={currentTheme} />
    <SpecItem value="2.7s" label="0-60 mph" currentTheme={currentTheme} />
    <SpecItem value="205 mph" label="Top Speed" currentTheme={currentTheme} />
  </View>
);

const SpecItem: React.FC<SpecItemProps> = ({ value, label, currentTheme }) => (
  <View style={[styles.specItem, { backgroundColor: currentTheme.card }]}>
    <Text style={[styles.specValue, { color: currentTheme.primary }]}>
      {value}
    </Text>
    <Text style={[styles.specLabel, { color: currentTheme.text }]}>
      {label}
    </Text>
  </View>
);

const Content: React.FC<ContentProps> = ({ currentTheme }) => (
  <View style={[styles.content, { backgroundColor: currentTheme.background }]}>
    <Text style={[styles.heading, { color: currentTheme.text }]}>
      The Art of Performance
    </Text>

    <Text style={[styles.paragraph, { color: currentTheme.text }]}>
      Experience the perfect blend of luxury and performance with the Porsche
      992 Turbo S. This masterpiece of engineering represents the pinnacle of
      automotive excellence, where every detail has been crafted to enhance the
      driving experience.
    </Text>

    <Specs currentTheme={currentTheme} />

    <Text style={[styles.paragraph, { color: currentTheme.text }]}>
      The 992 Turbo S is more than just a car; it's a statement of intent. With
      its 3.8-liter twin-turbocharged flat-six engine producing 650 horsepower
      and 590 lb-ft of torque, all-wheel drive system, and precision
      engineering, it represents the perfect harmony between form and function.
      The latest generation features enhanced aerodynamics with active elements,
      an 8-speed PDK transmission, and a sophisticated chassis that delivers
      unprecedented performance and driving dynamics.
    </Text>
  </View>
);

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ scrollY }) => {
  const animatedWrapperStyle = useAnimatedStyle(() => ({
    marginHorizontal: interpolate(
      scrollY.value,
      [0, -HEADER_HEIGHT / 4],
      [0, 15],
      Extrapolation.CLAMP
    ),
    borderRadius: interpolate(
      scrollY.value,
      [0, -HEADER_HEIGHT / 4],
      [60, 20],
      Extrapolation.CLAMP
    ),
    borderBottomLeftRadius: interpolate(
      scrollY.value,
      [0, -HEADER_HEIGHT / 4],
      [0, 20],
      Extrapolation.CLAMP
    ),
    borderBottomRightRadius: interpolate(
      scrollY.value,
      [0, -HEADER_HEIGHT / 4],
      [0, 20],
      Extrapolation.CLAMP
    ),
    overflow: "hidden",
  }));

  const animatedHeaderStyle = useAnimatedStyle(() => ({
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
  }));

  return (
    <Animated.View style={[animatedWrapperStyle]}>
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
  );
};

export default function ThemeTransition() {
  const { theme, toggleTheme } = useThemeContext();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const buttonScale = useSharedValue(1);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useScrollViewOffset(scrollRef);

  const handleThemeChange = () => {
    buttonScale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    toggleTheme();
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Lifestyle"
        onThemeChange={handleThemeChange}
        theme={theme}
        currentTheme={currentTheme}
        buttonStyle={buttonStyle}
      />
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        style={[styles.container, { backgroundColor: currentTheme.background }]}
        bounces={true}
      >
        <AnimatedHeader scrollY={scrollY} />
        <Content currentTheme={currentTheme} />
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
