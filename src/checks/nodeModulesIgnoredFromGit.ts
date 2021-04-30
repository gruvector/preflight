import { promises as fs } from 'node:fs';
import execa from 'execa';
import commandExample from '../commandExample';
import normalizeNewline from '../normalizeNewline';

export const title = 'node_modules/ folder ignored in Git';

export default async function nodeModulesIgnoredFromGit() {
  if ((await execa.command('git ls-files node_modules/')).stdout !== '') {
    throw new Error(
      `node_modules/ folder committed to Git. Remove it using:

        ${commandExample('git rm -r --cached node_modules')}
      `,
    );
  }

  if (
    (await execa.command('git ls-files .gitignore')).stdout !== '.gitignore'
  ) {
    throw new Error('.gitignore file not found');
  }

  const nodeModulesInGitignore = normalizeNewline(
    await fs.readFile('./.gitignore', 'utf8'),
  )
    .split('\n')
    .reduce((found, line) => found || /^\/?node_modules\/?$/.test(line), false);

  if (!nodeModulesInGitignore) {
    throw new Error('node_modules not found in .gitignore');
  }
}
