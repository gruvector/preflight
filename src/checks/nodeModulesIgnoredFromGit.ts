import execa from 'execa';
import { promises as fs } from 'fs';
import os from 'os';
import commandExample from '../commandExample';

export const title = 'node_modules/ folder ignored in Git';

export default async function nodeModulesIgnoredFromGit() {
  const { stdout: nodeModulesStdout } = await execa.command(
    'git ls-files node_modules/',
  );

  if (nodeModulesStdout !== '') {
    throw new Error(
      `node_modules/ folder committed to Git. Remove it using:
        ${commandExample('git rm -r --cached node_modules')}`,
    );
  }

  const { stdout: gitignoreStdout } = await execa.command(
    'git ls-files .gitignore',
  );

  if (gitignoreStdout !== '.gitignore') {
    throw new Error('.gitignore file not found');
  }

  const nodeModulesInGitignore = (await fs.readFile('./.gitignore', 'utf8'))
    .split(os.EOL)
    .reduce((found, line) => found || /^node_modules\/?$/.test(line), false);

  if (!nodeModulesInGitignore) {
    throw new Error('node_modules not found in .gitignore');
  }
}
