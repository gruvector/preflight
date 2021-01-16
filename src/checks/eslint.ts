import execa from 'execa';

export const title = 'ESLint';

export default async function eslintCheck() {
  try {
    await execa.command('yarn eslint . --max-warnings 0  --format compact');
  } catch (error) {
    throw new Error(
      `Errors found in files:\n${error.stdout
        .split('\n')
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
        .join('\n')}`,
    );
  }
}
