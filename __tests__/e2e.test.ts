import execa from 'execa';
import pMap from 'p-map';

async function cloneRepoToFixtures(repoPath: string, fixtureDirName: string) {
  return execa.command(
    `git clone --depth 1 --single-branch --branch=main https://github.com/${repoPath}.git __tests__/fixtures/${fixtureDirName}`,
  );
}

async function removeFixtureDir(fixtureDirName: string) {
  return execa.command(`rm -rf ./__tests__/fixtures/${fixtureDirName}`);
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
          cwd: `__tests__/fixtures/${dirName}`,
        }),
      { concurrency: 1 },
    );
  },
  // 2 minute timeout for yarn installation
  120000,
);

describe('Preflight', () => {
  it('passes in the react-passing test project', async () => {
    const { stdout, stderr } = await execa.command(`node ../../..`, {
      cwd: '__tests__/fixtures/react-passing',
    });

    const stdoutWithoutVersionNumber = stdout.replace(
      /(UpLeveled Preflight) v\d+\.\d+\.\d+/,
      '$1',
    );

    expect(stdoutWithoutVersionNumber).toMatchSnapshot();
    expect(stderr).toMatchSnapshot();
  });
});

afterAll(async () => {
  await pMap(
    Object.values(repoPathsToFixtureDirNames),
    async dirName => removeFixtureDir(dirName),
    { concurrency: 4 },
  );
});
