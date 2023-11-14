import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execaCommand } from 'execa';
import normalizeNewline from '../util/normalizeNewline';

export const title = 'Prettier';

export default async function prettierCheck() {
  try {
    await execaCommand(
      `${resolve(
        dirname(fileURLToPath(import.meta.url)),
        '..',
        'node_modules',
        '.bin',
      )}/prettier --list-different **/*.{js,jsx,ts,jsx} --end-of-line auto`,
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
        `,
      );
    }
  }
}
