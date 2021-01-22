import execa from 'execa';

export const title = 'All changes committed to Git';

export default async function allChangesCommittedToGit() {
  const { stdout } = await execa.command('git status --porcelain');

  if (stdout !== '') {
    throw new Error(
      `Some changes have not been committed to Git:
        ${stdout}
      `,
    );
  }
}
