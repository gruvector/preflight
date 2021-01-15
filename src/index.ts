import { Listr } from 'listr2';
import * as eslint from './checks/eslint';
import * as nodeModulesIgnoredFromGit from './checks/nodeModulesIgnoredFromGit';
import * as noSecretsCommittedToGit from './checks/noSecretsCommittedToGit';
import * as noUselessFilesCommittedToGit from './checks/noUselessFilesCommittedToGit';
import * as useSinglePackageManager from './checks/useSinglePackageManager';

const listrTasks = [
  eslint,
  nodeModulesIgnoredFromGit,
  noUselessFilesCommittedToGit,
  noSecretsCommittedToGit,
  useSinglePackageManager,
].map(module => ({
  title: module.title,
  task: module.default,
}));

await new Listr(listrTasks, {
  exitOnError: false,
  rendererOptions: { collapseErrors: false },
  concurrent: 5,
}).run();
