import chalk from 'chalk';

// https://www.compart.com/en/unicode/U+2800
// eslint-disable-next-line security/detect-bidi-characters -- Intentional use of unusual character for formatting
const emptyBrailleCharacter = '‎';

export default function commandExample(command: string) {
  return `${emptyBrailleCharacter}  ${chalk.dim('$')} ${command}`;
}
