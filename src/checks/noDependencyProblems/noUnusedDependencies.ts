import { execaCommand } from 'execa';
import commandExample from '../../util/commandExample';
import preflightBinPath from '../../util/preflightBinPath';

export const title = 'No unused dependencies';

export default async function noUnusedAndMissingDependencies() {
  const ignoredPackagePatterns = [
    // Unused dependency detected in https://github.com/upleveled/next-portfolio-dev
    '@graphql-codegen/cli',

    // Unused dependency detected in create-react-app
    '@testing-library/user-event',

    // Tailwind CSS
    '@tailwindcss/jit',
    'autoprefixer',
    'postcss',
    'tailwindcss',

    // Sass (eg. in create-react-app)
    'sass',

    // ESLint configuration
    'babel-eslint',
    'eslint-config-next',

    // Testing
    'babel-jest',
    'jest',
    'cypress',

    // TypeScript
    'typescript',
    '@types/*',

    // Next.js
    'sharp',
  ].join(',');

  try {
    await execaCommand(
      `${preflightBinPath}/depcheck --ignores="${ignoredPackagePatterns}"`,
    );
  } catch (error) {
    const { stdout } = error as { stdout: string };
    if (
      !stdout.startsWith('Unused dependencies') &&
      !stdout.startsWith('Unused devDependencies') &&
      !stdout.startsWith('Missing dependencies')
    ) {
      throw error;
    }

    const [unusedDependenciesStdout, missingDependenciesStdout] = stdout.split(
      'Missing dependencies',
    );

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
