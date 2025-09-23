import "@testing-library/jest-native/extend-expect";

jest.mock("expo-router", () => ({
  Link: ({ children }) => children,
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
}));

jest.mock("expo-image", () => {
  const { View } = require("react-native");
  return {
    Image: View,
  };
});

jest.mock("expo-constants", () => ({
  manifest: { extra: {} },
  expoConfig: {},
  systemFonts: [],
}));

jest.mock("react-native-safe-area-context", () => {
  return {
    SafeAreaProvider: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Mock Expo Winter runtime (not needed in tests)
jest.mock("expo/src/winter/runtime.native", () => ({}));
jest.mock("expo/src/winter/installGlobal", () => ({}));
