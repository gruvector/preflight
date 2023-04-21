import { sep } from 'node:path';
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

    // TODO: Remove this once depcheck issue is fixed:
    // PR: https://github.com/depcheck/depcheck/pull/790
    // Issue: https://github.com/depcheck/depcheck/issues/791
    //
    // Stylelint configuration
    'stylelint',
    'stylelint-config-upleveled',

    // Testing
    'babel-jest',
    'cypress',
    'jest',
    'jest-environment-jsdom',
    'jest-puppeteer',
    'playwright',
    'puppeteer',

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

        ${commandExample('pnpm remove <dependency name here>')}
      `);
    }

    if (missingDependenciesStdout) {
      /**
       * Temporary workaround to filter out eslint-config-upleveled peer dependencies
       * not listed in `package.json`, which are flagged as missing dependencies by depcheck
       *
       * TODO: Remove this variable once this depcheck issue is fixed:
       * https://github.com/depcheck/depcheck/issues/789
       */
      const missingDependenciesStdoutFiltered = missingDependenciesStdout
        .split('\n')
        .filter((missingDependency) => {
          return !(
            missingDependency.includes(`.${sep}.eslintrc.cjs`) &&
            [
              '@next/eslint-plugin-next',
              '@typescript-eslint/eslint-plugin',
              '@typescript-eslint/parser',
              'eslint-plugin-upleveled',
              'eslint-config-react-app',
              'eslint-import-resolver-typescript',
              'eslint-plugin-import',
              'eslint-plugin-jsx-a11y',
              'eslint-plugin-jsx-expressions',
              'eslint-plugin-react-hooks',
              'eslint-plugin-react',
              'eslint-plugin-security',
              'eslint-plugin-sonarjs',
              'eslint-plugin-unicorn',
            ].some((excludedDependency) =>
              missingDependency.includes(excludedDependency),
            )
          );
        })
        .join('\n');

      if (missingDependenciesStdoutFiltered) {
        messages.push(`Missing dependencies found:
        ${missingDependenciesStdoutFiltered
          .split('\n')
          .filter((str: string) => str.includes('* '))
          .join('\n')}

        Add these missing dependencies by running the following command for each dependency:

        ${commandExample('pnpm add <dependency name here>')}
      `);
      }
    }

    if (messages.length > 0) throw new Error(messages.join('\n\n'));
  }
}
