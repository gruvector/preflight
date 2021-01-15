import execa from 'execa';

export const title = 'node_modules/ folder ignored from Git';

export default async function nodeModulesIgnoredFromGit() {
  // TODO: Additional try/catch here to
  // 1. test if .gitignore is there
  // 2. read .gitignore and see if there's a line with exactly `node_modules` or `node_modules/`

  try {
    const response = await execa.command('git ls-files node_modules/');

    if (response.stdout) {
      // TODO: Add command for removing them
      throw Error(`node_modules/ folder committed to Git:\n${response.stdout}`);
    }
  } catch (error) {
    throw new Error(error);
  }
}
