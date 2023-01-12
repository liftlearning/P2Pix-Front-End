module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: { "@/(.*)": ["<rootDir>/src/$1"] },
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    ".*\\.(vue)$": "vue3-jest",
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.svg$": "<rootDir>/src/svgTransform.js",
  },
};
