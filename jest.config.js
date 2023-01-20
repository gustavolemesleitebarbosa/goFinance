module.exports = {
  preset: "jest-expo",

  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "jest-styled-components",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ],
  collectCoverage: true,
  collectCoverageFrom:[
    // collect coverage from all files inside src that have tsx extension
    "src/**/*.tsx",    
    // ignore tsx files (don't collect coverage from test files)
    "!src/**/*spec.tsx"
  ],
  coverageReporters :[
    //type of coverage reports
    "lcov"
  ]
}