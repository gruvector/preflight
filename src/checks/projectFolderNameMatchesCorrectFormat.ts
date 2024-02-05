import path from 'node:path';
import { commandExample } from '../util/commandExample';

export const title = 'Project folder name matches correct format';

export default function projectFolderNameMatchesCorrectFormat() {
  const currentDirectoryName = path.basename(process.cwd());
  const lowercaseHyphenedDirectoryName = currentDirectoryName
    .toLowerCase()
    .replaceAll(' ', '-');

  if (currentDirectoryName !== lowercaseHyphenedDirectoryName) {
    throw new Error(
      `Project directory name "${currentDirectoryName}" doesn't match the correct format (no spaces or uppercase letters).

        Rename the directory to the correct name "${lowercaseHyphenedDirectoryName}" with the following sequence of commands:

        ${commandExample('cd ..')}
        ${commandExample(
          `mv ${currentDirectoryName} ${lowercaseHyphenedDirectoryName}`,
        )}
        ${commandExample(`cd ${lowercaseHyphenedDirectoryName}`)}
      `,
    );
  }
}
