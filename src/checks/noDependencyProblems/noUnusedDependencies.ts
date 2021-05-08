import execa from 'execa';
import commandExample from '../../commandExample';
import preflightBinPath from '../../preflightBinPath';

export const title = 'No unused dependencies';

export default async function noUnusedDependencies() {
  const ignoredPackagePatterns = [
    // TODO: Remove this when repl.it fully supports `node:` prefixes
    // Instructions: https://gist.github.com/karlhorky/1a0f1a02a369e5d5015bdc6365142d77
    // Repl.it will support node: prefix: https://twitter.com/amasad/status/1390720114832543744
    '@babel/cli',
    '@upleveled/babel-plugin-remove-node-prefix',

    // TODO: Remove this when the PR gets accepted:
    // https://github.com/depcheck/depcheck/pull/635
    //
    // Ignore builtin modules with node: prefix
    'node:assert',
    'node:async_hooks',
    'node:buffer',
    'node:child_process',
    'node:cluster',
    'node:console',
    'node:constants',
    'node:crypto',
    'node:dgram',
    'node:dns',
    'node:domain',
    'node:events',
    'node:fs',
    'node:http',
    'node:http2',
    'node:https',
    'node:inspector',
    'node:module',
    'node:net',
    'node:os',
    'node:path',
    'node:perf_hooks',
    'node:process',
    'node:querystring',
    'node:readline',
    'node:repl',
    'node:stream',
    'node:string_decoder',
    'node:timers',
    'node:tls',
    'node:trace_events',
    'node:tty',
    'node:url',
    'node:util',
    'node:v8',
    'node:vm',
    'node:wasi',
    'node:worker_threads',
    'node:zlib',

    // Unused dependency detected in create-react-app
    '@testing-library/jest-dom',
    '@testing-library/react',
    '@testing-library/user-event',
    'react-scripts',
    'web-vitals',

    // Tailwind CSS
    '@tailwindcss/jit',
    'autoprefixer',
    'postcss',
    'tailwindcss',

    // ESLint configuration
    '@typescript-eslint/*',
    '@upleveled/eslint-config-upleveled',
    'babel-eslint',
    'eslint',
    'eslint-config-react-app',
    'eslint-import-resolver-typescript',
    'eslint-plugin-*',

    // Testing
    'babel-jest',
    'jest',
    'cypress',

    // TypeScript
    'typescript',
    '@types/*',
  ].join(',');

  try {
    await execa.command(
      `${preflightBinPath}/depcheck --ignores="${ignoredPackagePatterns}"`,
    );
  } catch (error) {
    if (
      !error.stdout.startsWith('Unused dependencies') &&
      !error.stdout.startsWith('Unused devDependencies')
    ) {
      throw error;
    }

    throw new Error(
      `Unused dependencies found:
        ${error.stdout
          .split('\n')
          .filter((str: string) => str.includes('* '))
          .join('\n')}

        Remove these dependencies running the following command for each dependency:

        ${commandExample('yarn remove <dependency name here>')}
      `,
    );
  }
}
