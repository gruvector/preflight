import execa from 'execa';
import { promises as fs } from 'fs';

export const title = 'All changes committed to Git';

export default async function allChangesCommittedToGit() {
  const { stdout: replSlug } = await execa.command('echo $REPL_SLUG');

  const isRunningInReplIt = replSlug !== '';

  if (isRunningInReplIt) {
    await fs.writeFile('.git/info/exclude', '.replit\n');
  }

  const { stdout } = await execa.command('git status --porcelain');

  if (stdout !== '') {
    throw new Error(
      `Some changes have not been committed to Git:
        ${stdout}
      `,
    );
  }
}
