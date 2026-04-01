import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '**/__tests__/api/**/*.test.ts',
        '**/__tests__/models/**/*.test.ts',
        '**/__tests__/lib/**/*.test.ts',
      ],
      transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }] },
      moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
    },
    {
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      testMatch: [
        '**/src/components/**/*.test.tsx',
        '**/src/app/**/*.test.tsx',
      ],
      transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }] },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.module\\.css$': '<rootDir>/src/__mocks__/styleMock.ts',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    },
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
  ],
  coverageThreshold: { global: { lines: 80 } },
};

export default createJestConfig(config);
