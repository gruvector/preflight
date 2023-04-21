import { sep } from 'node:path';
import { ESLint } from 'eslint';
import { execaCommand } from 'execa';

export const title = 'ESLint';

export default async function eslintCheck() {
  try {
    await execaCommand('pnpm eslint . --max-warnings 0  --format json');
  } catch (error) {
    const { stdout } = error as { stdout: string };

    let eslintResults;

    try {
      eslintResults = (JSON.parse(stdout) as ESLint.LintResult[])
        // Filter out results with no problems, which the ESLint CLI
        // still reports with the `--format json` flag
        .filter((eslintResult) => {
          return eslintResult.errorCount > 0 || eslintResult.warningCount > 0;
        });
    } catch (parseError) {
      throw error;
    }

    if (
      eslintResults.length < 1 ||
      !eslintResults.every(
        (result) => 'errorCount' in result && 'warningCount' in result,
      )
    ) {
      throw new Error(
        `Unexpected shape of ESLint JSON related to .errorCount and .warningCount properties - please report this to the UpLeveled engineering team, including the following output:
          ${stdout}
        `,
      );
    }

    throw new Error(
      `ESLint problems found in the following files:
        ${eslintResults
          // Make paths relative to the project:
          //
          // Before:
          //   macOS / Linux: /home/projects/next-student-project/app/api/hello/route.js
          //   Windows: C:\Users\Lukas\projects\next-student-project\app\api\hello\route.js
          //
          // After:
          //   macOS / Linux: app/api/hello/route.js
          //   Windows: app\api\hello\route.js
          .map(({ filePath }) => filePath.replace(`${process.cwd()}${sep}`, ''))
          .join('\n')}

        Open these files in your editor - there should be problems to fix
      `,
    );
  }
}
