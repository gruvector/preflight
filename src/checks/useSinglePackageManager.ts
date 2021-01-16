import execa from 'execa';
import commandExample from '../commandExample';

export const title = 'Use single package manager';

export default async function useSinglePackageManager() {
  const { stdout } = await execa.command('git ls-files package-lock.json');

  if (stdout !== '') {
    throw Error(`package-lock.json file committed to Git. Remove it with:
      ${commandExample('git rm --cached <filename>')}
      After you've removed it, you can delete the file with:
      ${commandExample('rm <filename>')}`);
  }
}
