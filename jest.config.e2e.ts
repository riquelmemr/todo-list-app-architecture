import config from "./jest.config";

config.testMatch = ["<rootDir>/test/**/*.e2e.ts"];
config.setupFilesAfterEnv = [
  "<rootDir>/test/setup/setup.ts",
  "<rootDir>/test/setup/setup-e2e.ts",
];

export default config;
