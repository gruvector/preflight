import execa from 'execa';
import normalizeNewline from '../normalizeNewline';
import wordWrap from '../wordWrap';

export const title = 'ESLint';

export default async function eslintCheck() {
  try {
    await execa.command('yarn eslint . --max-warnings 0  --format compact');
  } catch (error) {
    const { stdout } = error;
    const lines = stdout.split('\n');

    // If no ESLint problems detected, throw the error
    if (!/^\d+ problems?$/.test(lines[lines.length - 2])) {
      throw new Error(wordWrap(error.stderr));
    }

    throw new Error(
      wordWrap(
        `Errors found in files:
        ${normalizeNewline(error.stdout)
          .split('\n')
          // Match lines starting with slashes (macOS, Linux) or drive letters (Windows)
          .filter((line: string) => /^(\/|[A-Z]:\\)/.test(line))
          // Strip out the filename
          .map((line: string) => line.match(/^(([A-Z]:)?[^:]+):/)?.[1])
          // Remove duplicate filenames
          .reduce(
            (linesWithoutDuplicates: string[], line: string | undefined) => {
              if (line && !linesWithoutDuplicates.includes(line)) {
                linesWithoutDuplicates.push(line);
              }
              return linesWithoutDuplicates;
            },
            [],
          )
          .join('\n')}`,
      ),
    );
  }
}
