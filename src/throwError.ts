import wrapAnsi from 'wrap-ansi';

export default function wordWrap(
  message: string,
  indentationLevel: number = 1,
) {
  return wrapAnsi(
    message,
    // Reproduce same expression for the column width as used in `listr2`
    // https://github.com/cenk1cenk2/listr2/blob/f700f94c0cf50d2cfa1ed303773992714abc6d2b/src/renderer/default.renderer.ts#L430
    //
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (process.stdout.columns ?? 80) -
      // Remove the error message indentation
      // https://github.com/cenk1cenk2/listr2/issues/260#issuecomment-761598873
      2 * (indentationLevel + 1),
    { hard: true },
  );
}
