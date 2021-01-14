import { Listr } from 'listr2';
import * as eslint from './checks/eslint';
import * as noSecretsCommittedToGit from './checks/noSecretsCommittedToGit';
import * as noUselessFilesCommittedToGit from './checks/noUselessFilesCommittedToGit';

const listrTasks = [
  eslint,
  noUselessFilesCommittedToGit,
  noSecretsCommittedToGit,
].map(module => ({
  title: module.title,
  task: module.default,
}));

await new Listr(listrTasks, {
  exitOnError: false,
  rendererOptions: { collapseErrors: false },
  concurrent: 5,
}).run();
