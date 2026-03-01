import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],

  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1"
  },

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.jest.json"
      }
    ]
  },

  clearMocks: true
};

export default config;
