import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/convex/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['apps/jupiter/tsconfig.*?.json'],
      },
    },
  },
  {
    ignores: ['**/out-tsc', '**/_generated'],
  },
];
