// jest.config.js

export default {
  preset: 'ts-jest',
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
    '^.+\\.[tj]s$': 'ts-jest', // Поддержка TypeScript
  },
  moduleFileExtensions: ["js", "mjs", 'ts', 'json', 'node'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s'], // Ищет *.test.ts и *.spec.ts
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/js/reader.js",
    "src/js/parser.js"
  ]
};
