import execa from 'execa';

export const title = 'ESLint';

export default async function eslintCheck() {
  try {
    await execa.command('yarn eslint . --max-warnings 0');
  } catch {
    throw new Error('ESLint error message');
  }
}
