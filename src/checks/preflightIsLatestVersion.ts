import execa from 'execa';
import { promises as fs } from 'fs';
import semver from 'semver';
import { URL } from 'url';
import commandExample from '../commandExample';

export const title = 'Preflight is latest version';

export default async function preflightIsLatestVersion() {
  const { stdout: remoteVersion } = await execa.command(
    'npm show @upleveled/preflight version',
  );

  const localVersion = JSON.parse(
    await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8'),
  ).version;

  if (semver.gt(remoteVersion, localVersion)) {
    throw new Error(
      `Your current version of Preflight (${localVersion}) is out of date. The latest version is ${remoteVersion}. Upgrade with:

        ${commandExample('yarn global add @upleveled/preflight')}
      `,
    );
  }
}
