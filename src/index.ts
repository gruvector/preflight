import { promises as fs } from 'node:fs';
import { URL } from 'node:url';
import { Listr } from 'listr2';
import * as allChangesCommittedToGit from './checks/allChangesCommittedToGit.js';
import * as eslint from './checks/eslint.js';
import * as eslintConfigIsValid from './checks/eslintConfigIsValid.js';
import * as linkOnGithubAbout from './checks/linkOnGithubAbout.js';
import * as nodeModulesIgnoredFromGit from './checks/nodeModulesIgnoredFromGit.js';
import * as noDependenciesWithoutTypes from './checks/noDependencyProblems/noDependenciesWithoutTypes.js';
import * as noUnusedAndMissingDependencies from './checks/noDependencyProblems/noUnusedDependencies.js';
import * as noExtraneousFilesCommittedToGit from './checks/noExtraneousFilesCommittedToGit.js';
import * as noSecretsCommittedToGit from './checks/noSecretsCommittedToGit.js';
import * as preflightIsLatestVersion from './checks/preflightIsLatestVersion.js';
import * as prettier from './checks/prettier.js';
import * as useSinglePackageManager from './checks/useSinglePackageManager.js';
import { CtxParam } from './types/CtxParam.js';
import { TaskParam } from './types/TaskParam.js';

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

  // Version and configuration checks
  eslintConfigIsValid,
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
