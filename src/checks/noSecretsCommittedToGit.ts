import execa from 'execa';

export const title = 'No secrets committed to Git';

export default async function noSecretsCommittedToGit() {
  try {
    const response = await execa.command('git ls-files .env');

    if (response.stdout) {
      // TODO: Loop over each line and add commands for removing them (as well as all history in the git index)
      throw Error(`Secrets committed to Git:\n${response.stdout}`);
    }
  } catch (error) {
    throw new Error(error);
  }
}
