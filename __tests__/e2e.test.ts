import { execaCommand } from 'execa';
import pMap from 'p-map';

const fixturesTempDir = '__tests__/fixtures/__temp';

function cloneRepoToFixtures(repoPath: string, fixtureDirName: string) {
  return execaCommand(
    `git clone --depth 1 --single-branch --branch=main https://github.com/${repoPath}.git ${fixturesTempDir}/${fixtureDirName} --config core.autocrlf=input`,
  );
}

type Repo = {
  repoPath: string;
  dirName: string;
  installCommands?: string[];
};

const testRepos: Repo[] = [
  {
    repoPath: 'upleveled/preflight-test-project-react-passing',
    dirName: 'react-passing',
    // To use install commands, for example to install or upgrade
    // a package first, pass an installCommands array like this:
    // installCommands: [
    //   // To install the latest version of the ESLint config
    //   'pnpm upgrade --latest @upleveled/eslint-config-upleveled',
    //   // Avoid any issues with uncommitted files
    //   'git reset --hard HEAD',
    // ],
  },
];

beforeAll(
  async () => {
    await pMap(
      testRepos,
      ({ repoPath, dirName }) => cloneRepoToFixtures(repoPath, dirName),
      { concurrency: 4 },
    );

    await pMap(
      testRepos,
      async ({ dirName, installCommands }) => {
        if (!installCommands || installCommands.length < 1) {
          // Return array to keep return type uniform with
          // `return pMap()` below
          return [
            await execaCommand('pnpm install --frozen-lockfile', {
              cwd: `${fixturesTempDir}/${dirName}`,
            }),
          ];
        }

        return pMap(
          installCommands,
          (command) =>
            execaCommand(command, {
              cwd: `${fixturesTempDir}/${dirName}`,
            }),
          { concurrency: 1 },
        );
      },
      { concurrency: 1 },
    );
  },
  // 5 minute timeout for pnpm installation inside test repos
  300000,
);

test('Passes in the react-passing test project', async () => {
  const { stdout, stderr } = await execaCommand(
    `../../../../bin/preflight.js`,
    {
      cwd: `${fixturesTempDir}/react-passing`,
    },
  );

  const stdoutSortedWithoutVersionNumber = stdout
    .replace(/(UpLeveled Preflight) v\d+\.\d+\.\d+(-\d+)?/, '$1')
    .split('\n')
    .sort((a: string, b: string) => {
      if (b.includes('UpLeveled Preflight')) return 1;
      return a < b ? -1 : 1;
    })
    .join('\n')
    .trim();

  expect(stdoutSortedWithoutVersionNumber).toMatchSnapshot();
  expect(stderr.replace(/^\(node:\d+\) /, '')).toMatchSnapshot();
}, 30000);
