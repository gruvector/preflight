import { execaCommand } from 'execa';
import commandExample from '../util/commandExample';

export const title = 'Use single package manager';

export default async function useSinglePackageManager() {
  const { stdout } = await execaCommand('git ls-files package-lock.json');

  if (stdout !== '') {
    throw new Error(
      `package-lock.json file committed to Git. Remove it with:

        ${commandExample('git rm --cached <filename>')}

        After you've removed it, you can delete the file with:

        ${commandExample('rm <filename>')}

        The presence of this file indicates that npm was incorrectly used in addition to Yarn (eg. an "npm install" command was run). In order to avoid issues with the state of the yarn.lock file, we suggest also forcing regeneration this file with the following command:

        ${commandExample('yarn --force')}
      `,
    );
  }
}
