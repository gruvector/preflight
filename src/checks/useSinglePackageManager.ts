import execa from 'execa';

export const title = 'Use single package manager';

export default async function useSinglePackageManager() {
  // TODO: In the future, consider allowing students to use ONLY npm too
  try {
    const response = await execa.command('git ls-files package-lock.json');

    if (response.stdout) {
      // TODO: Add commands for removing the file
      throw Error(`npm package-lock.json committed to Git`);
    }
  } catch (error) {
    throw new Error(error);
  }
}
