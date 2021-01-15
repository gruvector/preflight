import execa from 'execa';

export const title = 'No useless files committed to Git';

export default async function noUselessFilesCommittedToGit() {
  try {
    const response = await execa.command('git ls-files .DS_Store');

    if (response.stdout) {
      // TODO: Loop over each line and add commands for removing them
      throw Error(`Useless files committed to Git:\n${response.stdout}`);
    }
  } catch (error) {
    throw new Error(error);
  }
}
