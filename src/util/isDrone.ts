import os from 'node:os';

export function isDrone() {
  return /Linux.+Alpine/.test(os.version());
}
