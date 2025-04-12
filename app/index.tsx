import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withDelay,
  interpolate,
  LinearTransition,
} from "react-native-reanimated";
import { Link } from "expo-router";

const BAR_WIDTH = 30;
const BAR_SPACING = 20;
const MAX_HEIGHT = 200;
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

// Predefined data patterns
const WEEKLY_DATA = [
  [60, 78, 65, 92, 70, 88, 58], // Wild but smooth crests
  [58, 85, 65, 75, 95, 70, 60], // Flowing rise and drop
  [65, 90, 70, 85, 60, 75, 55], // Peaky then swooping down
  [50, 68, 90, 72, 85, 60, 80], // Uneven rolling wave
  [55, 73, 60, 90, 65, 95, 70], // Big punch at the end
];

export default function Main() {
  const theme = useTheme();
  const [values, setValues] = React.useState(() => WEEKLY_DATA[0]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const maxValue = Math.max(...values);

  const handleRandomize = () => {
    // Get a random index different from the current one
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * WEEKLY_DATA.length);
    } while (newIndex === currentIndex);

    setCurrentIndex(newIndex);
    setValues(WEEKLY_DATA[newIndex]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {WEEKLY_DATA[currentIndex].map((value, index) => (
          <Bar
            key={index}
            value={value}
            day={DAYS[index]}
            index={index}
            theme={theme}
            maxValue={maxValue}
          />
        ))}
      </View>
      <Pressable
        onPress={handleRandomize}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.colors.primary },
        ]}
      >
        <Text style={styles.buttonText}>
          Show Different Week {currentIndex}
        </Text>
      </Pressable>
      <Link href="/theme-transition">
        <Text>Theme Transition</Text>
      </Link>
    </View>
  );
}

const Bar = ({
  value,
  day,
  index,
  theme,
  maxValue,
}: {
  value: number;
  day: string;
  index: number;
  theme: any;
  maxValue: number;
}) => {
  const height = useSharedValue(0);

  React.useEffect(() => {
    height.value = withSpring(value * 2, {
      damping: 18,
      stiffness: 180,
      mass: 1,
    });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(height.value, [0, maxValue * 2], [0, 1]);
    return {
      height: height.value,
      opacity: opacity,
    };
  });

  return (
    <Animated.View style={styles.barContainer}>
      <Animated.View style={[styles.bar, animatedStyle]} />
      <Text style={[styles.dayText, { color: theme.colors.text }]}>{day}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: MAX_HEIGHT + 40,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  barContainer: {
    marginHorizontal: BAR_SPACING / 2,
    alignItems: "center",
  },
  bar: {
    width: BAR_WIDTH,
    backgroundColor: "white",
    marginBottom: 8,
    borderRadius: 15,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
  },
});
