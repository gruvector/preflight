import execa from 'execa';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const title = 'Prettier';

export default async function prettierCheck() {
  try {
    // Default Prettier configuration from https://github.com/upleveled/system-setup
    const defaultConfigFromSystemSetup =
      '--single-quote true --trailing-comma all';

    await execa.command(
      `yarn --silent prettier --list-different ${process.cwd()}/**/*.{js,ts} --ignore-path ${process.cwd()}/.eslintignore ${defaultConfigFromSystemSetup}`,
      { cwd: dirname(fileURLToPath(import.meta.url)) },
    );
  } catch (error) {
    if (!error.stdout || error.stderr) {
      throw error;
    }

    throw new Error(
      `Prettier has not been run in the following files:
        ${error.stdout}
      `,
    );
  }
}
