import { execaCommand } from 'execa';

export async function isDrone() {
  const { stdout } = await execaCommand('cat /etc/os-release', {
    reject: false,
  });
  return /Alpine Linux/.test(stdout);
}
