import execa from 'execa';

export const title = 'All changes committed to Git';

export default async function allChangesCommittedToGit() {
  const { stdout: replSlug } = await execa.command('echo $REPL_SLUG');

  const isRunningInReplIt = replSlug !== '';

  if (isRunningInReplIt) {
    await execa.command('echo ".replit" >> .git/info/exclude');
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
