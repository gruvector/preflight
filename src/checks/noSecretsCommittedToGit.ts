import { execaCommand } from 'execa';
import { commandExample } from '../util/commandExample';

export const title = 'No secrets committed to Git';

export default async function noSecretsCommittedToGit() {
  const { stdout } = await execaCommand('git ls-files .env .env*.local');

  if (stdout !== '') {
    throw new Error(
      `Secrets committed to Git 😱:
        ${stdout}

        Remove these files from your repo by installing BFG from the System Setup Guide (see Optional Software at the bottom) and running it on each of your files like this:

        ${commandExample('bfg --delete-files <filename here>')}

        Once you've done this for every secret file, then force push to your repository:

        ${commandExample('git push --force')}

        More info: https://docs.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository

        Finally, make sure that this doesn't happen again by adding the filenames above to your .gitignore file.
      `,
    );
  }
}
