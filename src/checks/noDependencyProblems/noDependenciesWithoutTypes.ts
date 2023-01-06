import { existsSync, promises as fs } from 'node:fs';
import algoliasearch from 'algoliasearch';
import pReduce from 'p-reduce';
import commandExample from '../../util/commandExample';
import { projectPackageJson } from '../../util/packageJson';

const client = algoliasearch(
  // Application ID and API key specific to UpLeveled
  // Preflight. Please don't use anywhere else without
  // asking Algolia's permission.
  'OFCNCOG2CU', // Application ID
  'ec73550aa8b2936dab436d4e02144784', // API Key
);
const index = client.initIndex('npm-search');

interface AlgoliaObj {
  types?: {
    definitelyTyped?: string;
  };
}

export const title = 'No dependencies without types';

// This is a naive check for matching @types/<pkg name> packages
// that the student hasn't yet installed. It is not intended to
// be an exhaustive check for any types for all packages.
//
// It attempts to address scenarios such as this with
// `styled-components`:
//
// https://learn.upleveled.io/courses/btcmp-l-webfs-gen-0/modules/122-cheatsheet-css-in-js/#eslint-errors-with-styled-components
export default async function noDependenciesWithoutTypes() {
  const { devDependencies = {}, dependencies = {} } = projectPackageJson;

  const dependenciesWithMissingTypes = await pReduce(
    Object.keys(dependencies),
    async (filteredDependencies: [string, string][], dependency: string) => {
      try {
        const packageJsonPath = require.resolve(`${dependency}/package.json`);

        const modulePackageJson = JSON.parse(
          await fs.readFile(packageJsonPath, 'utf-8'),
        );

        // If the keys "types" or "typings" are in the module's `package.json`, bail out
        if ('types' in modulePackageJson || 'typings' in modulePackageJson) {
          return filteredDependencies;
        }
      } catch (err) {}

      let indexDTsPath;

      try {
        indexDTsPath = require.resolve(`${dependency}/index.d.ts`);
      } catch (err) {}

      // If the index.d.ts file exists inside the module's directory, bail out
      if (indexDTsPath && existsSync(indexDTsPath)) {
        return filteredDependencies;
      }

      const results = await index.getObject<AlgoliaObj>(dependency, {
        attributesToRetrieve: ['types'],
      });

      const definitelyTypedPackageName = results.types?.definitelyTyped;

      if (definitelyTypedPackageName) {
        // If a matching `@types/<package name>` has been already installed in devDependencies, bail out
        if (Object.keys(devDependencies).includes(definitelyTypedPackageName)) {
          return filteredDependencies;
        }

        filteredDependencies.push([dependency, definitelyTypedPackageName]);
      }

      return filteredDependencies;
    },
    [],
  );

  if (dependenciesWithMissingTypes.length > 0) {
    throw new Error(
      `Dependencies found without types. Add the missing types with:

      ${commandExample(
        `yarn add --dev ${dependenciesWithMissingTypes
          .map(([, definitelyTypedPackageName]) => definitelyTypedPackageName)
          .join(' ')}`,
      )}

      If the dependencies above are already in your package.json, check that they have not been incorrectly installed as regular dependencies in the "dependencies" object - they should be installed inside "devDependencies" (using the --dev flag mentioned above). To fix this situation, remove the dependencies and run the command above exactly.
      `,
    );
  }
}
