import { promises as fs } from 'fs';
import { Listr } from 'listr2';
import { URL } from 'url';
import * as allChangesCommittedToGit from './checks/allChangesCommittedToGit';
import * as eslint from './checks/eslint';
import * as nodeModulesIgnoredFromGit from './checks/nodeModulesIgnoredFromGit';
import * as noExtraneousFilesCommittedToGit from './checks/noExtraneousFilesCommittedToGit';
import * as noSecretsCommittedToGit from './checks/noSecretsCommittedToGit';
import * as preflightIsLatestVersion from './checks/preflightIsLatestVersion';
import * as useSinglePackageManager from './checks/useSinglePackageManager';

const version = JSON.parse(
  await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8'),
).version;

console.log(`🚀 UpLeveled Preflight v${version}`);

const listrTasks = [
  // ======= Sync Tasks =======
  // Git
  allChangesCommittedToGit,
  nodeModulesIgnoredFromGit,
  noExtraneousFilesCommittedToGit,
  noSecretsCommittedToGit,

  // Package Managers
  useSinglePackageManager,

  // ======= Async Tasks =======
  // Linting
  eslint,

  // Preflight
  preflightIsLatestVersion,
].map(module => ({
  title: module.title,
  task: module.default,
}));

await new Listr(listrTasks, {
  exitOnError: false,
  rendererOptions: { collapseErrors: false },
  concurrent: 5,
}).run();
