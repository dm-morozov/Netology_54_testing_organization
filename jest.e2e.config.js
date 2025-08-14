export default {
  preset: 'ts-jest',
  testEnvironment: 'node', // Puppeteer всё равно управляет браузером из Node
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'mjs', 'ts', 'json', 'node'],
  testMatch: ['**/ts/__tests__/e2e/**/*.test.ts'], // Ищем только e2e
  testTimeout: 30000, // больше времени, чтобы всё успело
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    }
  }
};
