import { promises as fs } from 'node:fs';
import { execaCommand } from 'execa';
import commandExample from '../util/commandExample';
import { isDrone } from '../util/isDrone';

export const title = 'All changes committed to Git';

export default async function allChangesCommittedToGit() {
  const { stdout: replSlug } = await execaCommand('echo $REPL_SLUG');

  const isRunningInReplIt = replSlug !== '';

  if (isRunningInReplIt) {
    await fs.writeFile('.git/info/exclude', '.replit\n');
  }

  const { stdout } = await execaCommand('git status --porcelain');

  if (stdout !== '') {
    const onlyYarnLockModifiedOnDrone =
      stdout.trim() === 'M yarn.lock' && (await isDrone());
    throw new Error(
      `Some changes have not been committed to Git:
        ${stdout}${
        onlyYarnLockModifiedOnDrone
          ? `

        The only file with changes is the yarn.lock file, indicating that npm was incorrectly used in addition to Yarn (eg. an "npm install" command was run). To fix this, force regeneration of the yarn.lock file locally with the following command and then commit the changes:

        ${commandExample('yarn --force')}`
          : ''
      }
      `,
    );
  }
}
