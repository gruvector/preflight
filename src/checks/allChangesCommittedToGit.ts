import { promises as fs } from 'node:fs';
import execa from 'execa';
import commandExample from '../util/commandExample';
import { isDrone } from '../util/isDrone';

export const title = 'All changes committed to Git';

export default async function allChangesCommittedToGit() {
  const { stdout: replSlug } = await execa.command('echo $REPL_SLUG');

  const isRunningInReplIt = replSlug !== '';

  if (isRunningInReplIt) {
    await fs.writeFile('.git/info/exclude', '.replit\n');
  }

  const { stdout } = await execa.command('git status --porcelain');

  if (stdout !== '') {
    const onlyYarnLockModifiedOnDrone =
      stdout.trim() === ` M yarn.lock` && isDrone();
    throw new Error(
      `Some changes have not been committed to Git:
        ${stdout}${
        onlyYarnLockModifiedOnDrone
          ? `

        The only file with changes is the yarn.lock file. indicates that npm was incorrectly used in addition to Yarn (eg. an "npm install" command was run). To fix this, force regeneration the yarn.lock file locally with the following command and then commit the changes:

        ${commandExample('yarn --force')}`
          : ''
      }
      `,
    );
  }
}
