import execa from 'execa';
import commandExample from '../../commandExample';
import preflightBinPath from '../../preflightBinPath';

export const title = 'No unused dependencies';

export default async function noUnusedAndMissingDependencies() {
  const ignoredPackagePatterns = [
    // TODO: Remove this when repl.it fully supports `node:` prefixes
    // Instructions: https://gist.github.com/karlhorky/1a0f1a02a369e5d5015bdc6365142d77
    // Repl.it will support node: prefix: https://twitter.com/amasad/status/1390720114832543744
    '@babel/cli',
    '@upleveled/babel-plugin-remove-node-prefix',

    // Unused dependency detected in create-react-app
    '@testing-library/jest-dom',
    '@testing-library/react',
    '@testing-library/user-event',
    'react-scripts',
    'web-vitals',

    // Tailwind CSS
    '@tailwindcss/jit',
    'autoprefixer',
    'postcss',
    'tailwindcss',

    // ESLint configuration
    '@typescript-eslint/*',
    '@upleveled/eslint-config-upleveled',
    'babel-eslint',
    'eslint',
    'eslint-config-react-app',
    'eslint-import-resolver-typescript',
    'eslint-plugin-*',

    // Testing
    'babel-jest',
    'jest',
    'cypress',

    // TypeScript
    'typescript',
    '@types/*',
  ].join(',');

  try {
    await execa.command(
      `${preflightBinPath}/depcheck --ignores="${ignoredPackagePatterns}"`,
    );
  } catch (error) {
    if (
      !error.stdout.startsWith('Unused dependencies') &&
      !error.stdout.startsWith('Unused devDependencies') &&
      !error.stdout.startsWith('Missing dependencies')
    ) {
      throw error;
    }

    const [
      unusedDependenciesStdout,
      missingDependenciesStdout,
    ] = error.stdout.split('Missing dependencies');

    const messages = [];

    if (unusedDependenciesStdout) {
      messages.push(`Unused dependencies found:
        ${unusedDependenciesStdout
          .split('\n')
          .filter((str: string) => str.includes('* '))
          .join('\n')}

        Remove these dependencies by running the following command for each dependency:

        ${commandExample('yarn remove <dependency name here>')}
      `);
    }

    if (missingDependenciesStdout) {
      messages.push(`Missing dependencies found:
        ${missingDependenciesStdout
          .split('\n')
          .filter((str: string) => str.includes('* '))
          .join('\n')}

        Add these missing dependencies by running the following command for each dependency:

        ${commandExample('yarn add <dependency name here>')}
      `);
    }

    throw new Error(messages.join('\n\n'));
  }
}
