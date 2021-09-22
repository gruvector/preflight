import execa from 'execa';

export async function isDrone() {
  const { stdout } = await execa.command('cat /etc/os-release', {
    reject: false,
  });
  return /Alpine Linux/.test(stdout);
}
