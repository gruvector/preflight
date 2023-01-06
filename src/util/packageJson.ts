import { promises as fs } from 'node:fs';
import { URL } from 'node:url';

type PackageJson = {
  name: string;
  version: string;
  description?: string;
  keywords?: string;
  homepage?: string;
  bugs?: {
    email?: string;
    url?: string;
  };
  license?: string;
  author?:
    | string
    | {
        name: string;
        email?: string;
        url?: string;
      };
  contributors?:
    | string[]
    | {
        name: string;
        email?: string;
        url?: string;
      }[];
  files?: string[];
  main?: string;
  browser?: string;
  bin?: Record<string, string>;
  man?: string;
  directories?: {
    lib?: string;
    bin?: string;
    man?: string;
    doc?: string;
    example?: string;
    test?: string;
  };
  repository?: {
    type?: 'git';
    url?: string;
    directory?: string;
  };
  scripts?: Record<string, string>;
  config?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  bundledDependencies?: string[];
  engines?: Record<string, string>;
  os?: string[];
  cpu?: string[];
};

export const projectPackageJson = JSON.parse(
  await fs.readFile('package.json', 'utf-8'),
) as PackageJson;

export const preflightPackageJson = JSON.parse(
  await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8'),
) as PackageJson;
