import execa from 'execa';
import os from 'os';

export const title = 'ESLint';

export default async function eslintCheck() {
  try {
    await execa.command('yarn eslint . --max-warnings 0  --format compact');
  } catch (error) {
    const { stdout } = error;
    const lines = stdout.split('\n');

    // If no ESLint problems detected, throw the error
    if (!/^\d+ problems?$/.test(lines[lines.length - 2])) {
      throw new Error(error.stderr);
    }

    throw new Error(
      `Errors found in files:
        ${error.stdout
          .split(os.EOL)
          // Match lines starting with slashes (macOS, Linux) or drive letters (Windows)
          .filter((line: string) => /^(\/|[A-Z]:\\)/.test(line))
          // Strip out the filename
          .map((line: string) => line.match(/^(([A-Z]:)?[^:]+):/)?.[1])
          // Remove duplicate filenames
          .reduce((linesWithoutDuplicates: string[], line: string) => {
            if (!linesWithoutDuplicates.includes(line)) {
              linesWithoutDuplicates.push(line);
            }
            return linesWithoutDuplicates;
          }, [])
          .join(os.EOL)}`,
    );
  }
}
