import { Stack } from "expo-router";
import { ThemeProvider } from "../components/theme-context";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
