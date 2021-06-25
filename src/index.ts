import { promises as fs } from 'node:fs';
import { URL } from 'node:url';
import { Listr } from 'listr2';
import * as allChangesCommittedToGit from './checks/allChangesCommittedToGit';
import * as eslint from './checks/eslint';
import * as eslintConfigIsLatestVersion from './checks/eslintConfigIsLatestVersion';
import * as linkOnGithubAbout from './checks/linkOnGithubAbout';
import * as nodeModulesIgnoredFromGit from './checks/nodeModulesIgnoredFromGit';
import * as noDependenciesWithoutTypes from './checks/noDependencyProblems/noDependenciesWithoutTypes';
import * as noUnusedAndMissingDependencies from './checks/noDependencyProblems/noUnusedDependencies';
import * as noExtraneousFilesCommittedToGit from './checks/noExtraneousFilesCommittedToGit';
import * as noSecretsCommittedToGit from './checks/noSecretsCommittedToGit';
import * as preflightIsLatestVersion from './checks/preflightIsLatestVersion';
import * as prettier from './checks/prettier';
import * as useSinglePackageManager from './checks/useSinglePackageManager';
import { CtxParam } from './types/CtxParam';
import { TaskParam } from './types/TaskParam';

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
  // Dependencies
  {
    title: 'No dependency problems',
    task: (ctx: CtxParam, task: TaskParam): Listr =>
      task.newListr([
        {
          title: noUnusedAndMissingDependencies.title,
          task: noUnusedAndMissingDependencies.default,
        },
        {
          title: noDependenciesWithoutTypes.title,
          task: noDependenciesWithoutTypes.default,
        },
      ]),
  },

  // GitHub
  linkOnGithubAbout,

  // Linting
  eslint,
  prettier,

  // Version checks
  eslintConfigIsLatestVersion,
  preflightIsLatestVersion,
].map((module) => {
  if ('task' in module) return module;
  return {
    title: module.title,
    task: module.default,
  };
});

await new Listr(listrTasks, {
  exitOnError: false,
  rendererOptions: {
    collapseErrors: false,
    removeEmptyLines: false,
    formatOutput: 'wrap',
  },
  concurrent: 5,
}).run();
