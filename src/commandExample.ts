import chalk from 'chalk';

// https://www.compart.com/en/unicode/U+2800
const emptyBrailleCharacter = '‎';

export default function commandExample(command: string) {
  return `${emptyBrailleCharacter}
  ${emptyBrailleCharacter}  ${chalk.dim('$')} ${command}
  ${emptyBrailleCharacter}`;
}
