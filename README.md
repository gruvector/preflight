# UpLeveled Preflight

A command line tool to check your UpLeveled projects before you submit

<img src="screenshot.png" alt="A command line tool showing various passing tests that have run against a software project" />

## Install

```bash
yarn global add @upleveled/preflight
```

## Run

```bash
preflight
```

## Install and Run on [repl.it](https://repl.it/)

To run on [repl.it](https://repl.it/) (or any other environment that doesn't have a compatible version of Node.js), install Preflight as follows:

```bash
yarn global add @upleveled/preflight node --ignore-engines
```

Then you can use the path to the global `node` and `preflight` modules to run it:

```bash
/home/runner/.config/yarn/global/node_modules/node/bin/node /home/runner/.config/yarn/global/node_modules/@upleveled/preflight/dist/preflight.esm.js
```

More information here: https://github.com/upleveled/preflight/issues/17
