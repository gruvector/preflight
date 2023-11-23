import upleveled from 'eslint-config-upleveled';

/** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
const config = [
  ...upleveled,
  {
    languageOptions: {
      parserOptions: {
        EXPERIMENTAL_useProjectService: true,
        project: './tsconfig.json',
      },
    },
  },
];

export default config;
