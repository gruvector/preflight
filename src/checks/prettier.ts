import execa from 'execa';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import normalizeNewline from '../normalizeNewline';

export const title = 'Prettier';

export default async function prettierCheck() {
  try {
    // Default Prettier configuration from https://github.com/upleveled/system-setup
    const defaultConfigFromSystemSetup =
      '--single-quote true --trailing-comma all';

    await execa.command(
      `yarn --silent prettier --list-different ${process.cwd()}/**/*.{js,ts} --ignore-path ${process.cwd()}/.eslintignore ${defaultConfigFromSystemSetup} --end-of-line auto`,
      { cwd: dirname(fileURLToPath(import.meta.url)) },
    );
  } catch (error) {
    const stderrWithoutPackageJsonWarning = error.stderr.replace(
      /warning [/.\\]+package\.json: No license field/,
      '',
    );

    if (!error.stdout || stderrWithoutPackageJsonWarning) {
      throw error;
    }

    const ignoredFilePatterns = [
      // File from create-react-app not matching our formatting
      // https://github.com/facebook/create-react-app/blob/fdbde1f3c256b43d5386b5ae3a75083dbd8f0aff/packages/cra-template/template/src/reportWebVitals.js
      /src[/\\]reportWebVitals\.js$/,

      // Files from create-next-app not matching our formatting
      // https://github.com/vercel/next.js/blob/5a73859fe8d3659d52e169f97188ae422e0d2ace/packages/create-next-app/templates/default/pages/api/hello.js
      /pages[/\\]api[/\\]hello\.js$/,
      // https://github.com/vercel/next.js/blob/aacfa79ddf88e4e1488b63ac253af27110f0a151/packages/create-next-app/templates/default/pages/_app.js
      /pages[/\\]_app\.js$/,
    ];

    const unformattedFiles = normalizeNewline(error.stdout)
      .split('\n')
      .map((file) =>
        // Make paths relative to the project instead of Preflight, eg:
        // before: ../../../../../../projects/random-color-generator-react-app/src/reportWebVitals.js
        // after: random-color-generator-react-app/src/reportWebVitals.js
        file.replace(/^([A-Z]:|\.\.[/\\])[a-zA-Z0-9-_/.\\ ]*projects[/\\]/, ''),
      )
      .filter(
        (file) =>
          !ignoredFilePatterns.some((ignoredFilePattern) =>
            ignoredFilePattern.test(file),
          ),
      );

    if (unformattedFiles.length > 0) {
      throw new Error(
        `Prettier has not been run in the following files:
        ${unformattedFiles.join('\n')}
      `,
      );
    }
  }
}
