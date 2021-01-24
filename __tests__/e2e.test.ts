import execa from 'execa';
import pMap from 'p-map';

const fixturesTempDir = '__tests__/fixtures/__temp';

async function cloneRepoToFixtures(repoPath: string, fixtureDirName: string) {
  return execa.command(
    `git clone --depth 1 --single-branch --branch=main https://github.com/${repoPath}.git ${fixturesTempDir}/${fixtureDirName}`,
  );
}

const repoPathsToFixtureDirNames = {
  'upleveled/preflight-test-project-react-passing': 'react-passing',
};

beforeAll(
  async () => {
    await pMap(
      Object.entries(repoPathsToFixtureDirNames),
      async ([repoPath, dirName]) => cloneRepoToFixtures(repoPath, dirName),
      { concurrency: 4 },
    );

    await pMap(
      Object.values(repoPathsToFixtureDirNames),
      async dirName =>
        execa.command('yarn --frozen-lockfile', {
          cwd: `${fixturesTempDir}/${dirName}`,
        }),
      { concurrency: 1 },
    );
  },
  // 2 minute timeout for yarn installation
  120000,
);

describe('Preflight', () => {
  it('passes in the react-passing test project', async () => {
    const { stdout, stderr } = await execa.command(
      `../../../../bin/preflight.js`,
      {
        cwd: `${fixturesTempDir}/react-passing`,
      },
    );

    const stdoutSortedWithoutVersionNumber = stdout
      .replace(/(UpLeveled Preflight) v\d+\.\d+\.\d+/, '$1')
      .split('\n')
      .sort((a: string, b: string) => {
        if (b.includes('UpLeveled Preflight')) return 1;
        return a < b ? -1 : 1;
      })
      .join('\n');

    expect(stdoutSortedWithoutVersionNumber).toMatchSnapshot();
    expect(stderr).toMatchSnapshot();
  });
});

afterAll(async () => {
  await execa.command(`rm -rf ./${fixturesTempDir}/`);
});
