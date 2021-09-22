import execa from 'execa';
import commandExample from '../util/commandExample';

export const title = 'No extraneous files committed to Git';

export default async function noExtraneousFilesCommittedToGit() {
  const { stdout } = await execa.command(
    'git ls-files .DS_Store yarn-error.log npm-debug.log',
  );

  if (stdout !== '') {
    throw new Error(
      `Extraneous files committed to Git:
        ${stdout}

        Remove these files from your repo by running the following command for each file:

        ${commandExample('git rm --cached <filename here>')}

        Once you've removed all files, make sure that it doesn't happen again by adding the filenames above to your .gitignore file.
      `,
    );
  }
}
