import execa from 'execa';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const title = 'Prettier';

export default async function prettierCheck() {
  try {
    await execa.command(
      `yarn prettier --list-different "${process.cwd()}/**/*.{js,ts}" --ignore-path .eslintignore`,
      { cwd: dirname(fileURLToPath(import.meta.url)) },
    );
  } catch (error) {
    if (!error.stdout) {
      throw error;
    }

    throw new Error(
      `Prettier has not been run in the following files:
        ${error.stdout}
      `,
    );
  }
}
