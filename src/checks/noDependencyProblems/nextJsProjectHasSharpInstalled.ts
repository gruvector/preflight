import { commandExample } from '../../util/commandExample';
import { projectPackageJson } from '../../util/packageJson';

export const title = 'Next.js project has sharp installed';

export default function nextJsProjectHasSharpInstalled() {
  const dependenciesPackageNames = Object.keys(
    projectPackageJson.dependencies || {},
  );
  if (
    dependenciesPackageNames.includes('next') &&
    !dependenciesPackageNames.includes('sharp')
  ) {
    throw new Error(
      `Next.js projects should have sharp installed for better image optimization. Install it with:

        ${commandExample('pnpm add sharp')}
      `,
    );
  }
}
