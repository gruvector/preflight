import { promises as fs } from 'node:fs';
import os from 'node:os';
import { URL } from 'node:url';
import execa from 'execa';
import semver from 'semver';
import commandExample from '../util/commandExample';

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

        ${commandExample(
          `${
            os.platform() === 'linux' ? 'sudo ' : ''
          }yarn global add @upleveled/preflight`,
        )}
      `,
    );
  }
}
