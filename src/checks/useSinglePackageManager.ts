import { execaCommand } from 'execa';
import commandExample from '../util/commandExample';

export const title = 'Use single package manager';

export default async function useSinglePackageManager() {
  const { stdout } = await execaCommand(
    'git ls-files package-lock.json yarn.lock',
  );

  if (stdout !== '') {
    throw new Error(
      `package-lock.json or yarn.lock file committed to Git. Remove it with:

        ${commandExample('git rm --cached <filename>')}

        After you've removed it, you can delete the file with:

        ${commandExample('rm <filename>')}

        The presence of this file indicates that another package manager was used in addition to pnpm (eg. "npm install" or "yarn add" was run). In order to avoid issues with the state of the pnpm-lock.yaml file, we suggest also forcing regeneration this file with the following command:

        ${commandExample('pnpm install --force')}
      `,
    );
  }
}
