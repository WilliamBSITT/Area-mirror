// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native" +
      "|@react-native" +
      "|@react-navigation" +
      "|expo(nent)?|@expo(nent)?/.*" +
      "|expo-router" +
      "|react-clone-referenced-element" +
      "|@expo-google-fonts/.*" +
      "|expo-image" +
      "))"
  ],
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.js"
  ],
};
