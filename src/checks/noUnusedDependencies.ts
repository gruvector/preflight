import execa from 'execa';
import commandExample from '../commandExample';
import preflightBinPath from '../preflightBinPath';

export const title = 'No unused dependencies';

export default async function noUnusedDependencies() {
  const ignoredPackagePatterns = [
    '@size-limit/*',
    '@typescript-eslint/*',
    '@upleveled/*',
    'babel-*',
    'depcheck',
    'eslint',
    'eslint-*',
    'tslib',
    'typescript',
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
