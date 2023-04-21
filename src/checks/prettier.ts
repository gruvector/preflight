import { dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execaCommand } from 'execa';
import normalizeNewline from '../util/normalizeNewline';

export const title = 'Prettier';

export default async function prettierCheck() {
  try {
    await execaCommand(
      `../node_modules/.bin/prettier --list-different ${process.cwd()}/**/*.{js,jsx,ts,jsx} --ignore-path ${process.cwd()}/.eslintignore --config ${process.cwd()}/prettier.config.cjs --end-of-line auto`,
      { cwd: dirname(fileURLToPath(import.meta.url)) },
    );
  } catch (error) {
    const { stdout, stderr } = error as { stdout: string; stderr: string };

    const stderrWithoutPackageJsonWarning = stderr.replace(
      /warning [/.\\]*package\.json: No license field[\r\n]*/g,
      '',
    );

    if (!stdout || stderrWithoutPackageJsonWarning) {
      throw error;
    }

    const unformattedFiles = normalizeNewline(stdout)
      .split('\n')
      // Make paths relative to the project:
      //
      // Before:
      //   macOS / Linux: ../../../../../../projects/random-color-generator-react-app/src/reportWebVitals.js
      //   Windows: ..\..\..\..\..\..\..\..\..\..\..\projects\random-color-generator-react-app\src\reportWebVitals.js
      //
      // After:
      //   macOS / Linux: src/reportWebVitals.js
      //   Windows: src\reportWebVitals.js
      .map((file) => {
        return file.replace(
          `${relative(
            dirname(fileURLToPath(import.meta.url)),
            process.cwd(),
          )}${sep}`,
          '',
        );
      });

    if (unformattedFiles.length > 0) {
      throw new Error(
        `Prettier has not been run in the following files:
          ${unformattedFiles.join('\n')}

          For each of the files above, open the file in your editor and save the file. This will format the file with Prettier, which will cause changes to appear in Git.

          In some very uncommon cases (this probably doesn't apply to you), the mismatch may come from inconsistent end of line characters. Read more here: https://github.com/upleveled/answers/issues/31
        `,
      );
    }
  }
}
