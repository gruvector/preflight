import execa from 'execa';

export const title = 'Prettier';

export default async function prettierCheck() {
  try {
    const prettierBinPath = require.resolve('prettier');
    await execa.command(
      `${prettierBinPath} --silent prettier --list-different "**/*.js" "**/*.ts" --ignore-path .eslintignore`,
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
