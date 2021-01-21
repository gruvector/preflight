import execa from 'execa';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const { stdout: preflightBinPath } = await execa.command(`yarn bin`, {
  cwd: dirname(fileURLToPath(import.meta.url)),
});

export default preflightBinPath;
