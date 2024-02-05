const CRLF = '\r\n';

export function normalizeNewlines(input: string) {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof input}\``);
  }

  return input.replace(new RegExp(CRLF, 'g'), '\n');
}
