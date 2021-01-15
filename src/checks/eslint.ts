import execa from 'execa';

export const title = 'ESLint';

export default async function eslintCheck() {
  try {
    await execa.command('yarn eslint . --max-warnings 0  --format compact');
  } catch (err) {
    throw new Error(
      `ESLint errors in these files:
      ${err.stdout
        .split('\n')
        .filter((line: string) => line.startsWith('/'))
        .map((line: string) => line.match(/^([^:]+):/)?.[1])
        .reduce((linesWithoutDuplicates: string[], line: string) => {
          if (!linesWithoutDuplicates.includes(line)) {
            linesWithoutDuplicates.push(line);
          }
          return linesWithoutDuplicates;
        }, [])
        .join('\n')}`
    );
  }
}
