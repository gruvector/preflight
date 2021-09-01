#!/usr/bin/env node

import execa from 'execa';

const regex = /^https:\/\/github\.com\/[a-zA-Z0-9\-.]+\/[a-zA-Z0-9\-.]+$/;

if (!process.argv[2].match(regex)) {
  console.error(`Argument doesn't match GitHub URL format. Example:

$ docker run ghcr.io/upleveled/preflight https://github.com/upleveled/preflight-test-project-react-passing`);
  process.exit(1);
}

const repoPath = 'repo-to-check';

async function executeCommand(command: string, cwd?: string) {
  const { stdout, stderr, exitCode } = await execa.command(command, {
    cwd,
    reject: false,
  });

  if (exitCode !== 0) {
    console.error(stderr);
    process.exit(1);
  } else {
    return stdout;
  }
}

await executeCommand(
  `git clone --depth 1 --single-branch --branch=main ${process.argv[2]} ${repoPath} --config core.autocrlf=input`,
);

await executeCommand('yarn install --ignore-scripts', repoPath);
const preflightCommand = await executeCommand('preflight', repoPath);

console.log(preflightCommand);
