import execa from 'execa';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const title = 'Prettier';

export default async function prettierCheck() {
  try {
    const { stdout: prettierBinPath } = await execa.command(
      'yarn bin prettier',
      {
        cwd: dirname(fileURLToPath(import.meta.url)),
      },
    );

    await execa.command(
      `${prettierBinPath} --list-different "**/*.{js,ts}" --ignore-path .eslintignore`,
      { cwd: process.cwd() },
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
