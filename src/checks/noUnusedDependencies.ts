import execa from 'execa';
import commandExample from '../commandExample';
import preflightBinPath from '../preflightBinPath';

export const title = 'No unused dependencies';

export default async function noUnusedDependencies() {
  const ignoredPackagePatterns = [
    // Unused dependency detected in create-react-app
    '@testing-library/user-event',

    // ESLint configuration
    '@typescript-eslint/*',
    '@upleveled/eslint-config-upleveled',
    'babel-eslint',
    'eslint',
    'eslint-config-react-app',
    'eslint-import-resolver-typescript',
    'eslint-plugin-*',

    // TypeScript
    'typescript',
    '@types/*',
  ].join(',');

  try {
    await execa.command(
      `${preflightBinPath}/depcheck --ignores="${ignoredPackagePatterns}"`,
    );
  } catch (error) {
    if (!error.stdout.startsWith('Unused dependencies')) throw error;

    throw new Error(
      `Unused dependencies found:
        ${error.stdout
          .split('\n')
          .filter((str: string) => str.includes('* '))
          .join('\n')}

        Remove these dependencies running the following command for each dependency:

        ${commandExample('yarn remove <dependency name here>')}
      `,
    );
  }
}
