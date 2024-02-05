import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execaCommand } from 'execa';

export const { stdout: preflightBinPath } = await execaCommand(`pnpm bin`, {
  cwd: dirname(fileURLToPath(import.meta.url)),
});
