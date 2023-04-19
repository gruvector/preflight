import { execaCommand } from 'execa';
import normalizeNewline from '../util/normalizeNewline';

export const title = 'ESLint';

export default async function eslintCheck() {
  try {
    await execaCommand('yarn eslint . --max-warnings 0  --format compact');
  } catch (error) {
    const { stdout } = error as { stdout: string };
    const lines = stdout.split('\n');

    // If no ESLint problems detected, throw the error
    if (!/^\d+ problems?$/.test(lines[lines.length - 2]!)) {
      throw error;
    }

    throw new Error(
      `ESLint problems found in the following files:
        ${normalizeNewline(stdout)
          .split('\n')
          // Match lines starting with slashes (macOS, Linux) or drive letters (Windows)
          .filter((line) => /^(\/|[A-Z]:\\)/.test(line))
          // Strip out the filename
          .map((line) => line.match(/^(([A-Z]:)?[^:]+):/)?.[1])
          // Remove duplicate filenames
          .reduce((linesWithoutDuplicates: string[], line) => {
            if (line && !linesWithoutDuplicates.includes(line)) {
              linesWithoutDuplicates.push(line);
            }
            return linesWithoutDuplicates;
          }, [])
          .join('\n')}

        Open these files in your editor - there should be problems to fix
      `,
    );
  }
}
