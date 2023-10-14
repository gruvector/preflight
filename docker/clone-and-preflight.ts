#!/usr/bin/env node

import { execaCommand, Options } from 'execa';

const regex = /^https:\/\/github\.com\/[a-zA-Z0-9\-.]+\/[a-zA-Z0-9\-.]+$/;

if (!process.argv[2] || !process.argv[2].match(regex)) {
  console.error(`Argument doesn't match GitHub URL format. Example:

$ docker run ghcr.io/upleveled/preflight https://github.com/upleveled/preflight-test-project-react-passing`);
  process.exit(1);
}

const projectPath = 'project-to-check';

async function executeCommand(command: string, options?: Pick<Options, 'cwd'>) {
  let all: string | undefined = '';
  let exitCode = 0;

  try {
    ({ all, exitCode } = await execaCommand(command, {
      cwd: options?.cwd,
      all: true,
    }));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  if (exitCode !== 0) {
    console.error(all);
    process.exit(1);
  } else {
    return all;
  }
}

console.log(`Cloning ${process.argv[2]}...`);
await executeCommand(
  `git clone --depth 1 ${
    !process.argv[3] ? '' : `--branch ${process.argv[3]}`
  } --single-branch ${
    process.argv[2]
  } ${projectPath} --config core.autocrlf=input`,
);

console.log('Installing dependencies...');
await executeCommand('pnpm install', { cwd: projectPath });

// Exit code of grep will be 0 if the `"postgres":`
// string is found in package.json, indicating that
// Postgres.js is installed and the project uses
// a PostgreSQL database
const projectUsesPostgresql =
  (
    await execaCommand('grep package.json -e \'"postgres":\'', {
      cwd: projectPath,
      shell: true,
      reject: false,
    })
  ).exitCode === 0;

if (projectUsesPostgresql) {
  console.log('Setting up PostgreSQL database...');

  // Set database connection environment variables (inherited in
  // all future execaCommand / executeCommand calls)
  process.env.PGHOST = 'localhost';
  process.env.PGDATABASE = 'project_to_check';
  process.env.PGUSERNAME = 'project_to_check';
  process.env.PGPASSWORD = 'project_to_check';

  // Create directory for PostgreSQL socket
  await executeCommand('mkdir /run/postgresql');
  await executeCommand('chown postgres:postgres /run/postgresql');

  // Run script as postgres user to:
  // - Create data directory
  // - Init database
  // - Start database
  // - Create database
  // - Create database user
  // - Create schema
  // - Grant permissions to database user
  //
  // Example script:
  // https://github.com/upleveled/preflight-test-project-next-js-passing/blob/e65717f6951b5336bb0bd83c15bbc99caa67ebe9/scripts/alpine-postgresql-setup-and-start.sh
  const postgresUid = Number((await executeCommand('id -u postgres'))!);
  await execaCommand('bash ./scripts/alpine-postgresql-setup-and-start.sh', {
    cwd: projectPath,
    // postgres user, for initdb and pg_ctl
    uid: postgresUid,
    // Show output to simplify debugging
    stdout: 'inherit',
    stderr: 'inherit',
  });

  console.log('Running migrations...');
  await executeCommand('pnpm migrate up', { cwd: projectPath });

  if (
    // Exit code of grep will be non-zero if the
    // `"@ts-safeql/eslint-plugin":` string is not found in
    // package.json, indicating that SafeQL has not been
    // installed
    (
      await execaCommand(
        'grep package.json -e \'"@ts-safeql/eslint-plugin":\'',
        {
          cwd: projectPath,
          shell: true,
          reject: false,
        },
      )
    ).exitCode !== 0
  ) {
    console.log(
      'SafeQL ESLint plugin not yet installed (project created on Windows machine), installing...',
    );
    await executeCommand('pnpm add @ts-safeql/eslint-plugin libpg-query', {
      cwd: projectPath,
    });

    // Commit packages.json and pnpm-lock.yaml changes to
    // avoid failing "All changes committed to Git" check
    await executeCommand(
      'git config user.email github-actions[bot]@users.noreply.github.com',
      { cwd: projectPath },
    );
    await executeCommand('git config user.name github-actions[bot]', {
      cwd: projectPath,
    });
    await executeCommand(
      'git commit --all --message Add\\ SafeSQL\\ for\\ Windows',
      { cwd: projectPath },
    );
  }
}

console.log('Running Preflight...');
const preflightOutput = await executeCommand('preflight', { cwd: projectPath });

if (preflightOutput) {
  console.log(
    preflightOutput
      // node-fetch@3 (dependency in Preflight) uses experimental Node.js
      // APIs. Until these are no longer experimental, remove the warning
      // from the output manually.
      .replace(
        /\(node:\d+\) ExperimentalWarning: stream\/web is an experimental feature\. This feature could change at any time\n\(Use `node --trace-warnings \.\.\.` to show where the warning was created\)\n/,
        '',
      ),
  );
}
