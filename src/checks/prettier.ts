import execa from 'execa';

export const title = 'Prettier';

export default async function prettierCheck() {
  try {
    await execa.command(
      'yarn --silent prettier --list-different "**/*.js" "**/*.ts" --ignore-path .eslintignore',
    );
  } catch (error) {
    if (error.stderr) {
      throw error;
    }

    throw new Error(
      `Prettier has not been run in the following files:
        ${error.stdout}
      `,
    );
  }
}
