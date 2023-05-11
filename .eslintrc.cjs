/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const config = {
  extends: ['upleveled'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.json',
      './tsconfig.nonsrc.json',
      './bin/tsconfig.json',
    ],
  },
};

module.exports = config;
