# Svelte Check Monorepo

Repo to illustrate how it's not possible to exclude certain files. This example is highly simplistic, just enough complexity to show the problem.

## Overview

In this monorepo, we have 2 projects. 

1. `svelte-project` - a sveltekit project, it has the default `verbatimModuleSyntax` of true.
1. `project-1` - a lib that svelte-project imports. It's tsconfig sets `verbatimModuleSyntax` to false.

The `tsconfig.base.json` in the root of the project details the import alias for `project-1`, so that `svelte-project` can import it as `@project/first` to treat it like an external dependency, but in reality it exists in the same repo.

The `svelte.config.ts` file reads the `tsconfig.base.json`, adjusts the paths so they match the location as the `.svelte-kit/tsconfig.json` will expect them. It then combines the paths from that base config to the one svelte uses.

The `vite.config.ts` file does a similar thing, where it tells vite how to resolve the `@project/first` at it's actual location.

## Set up

1. Ensure you have node >= 18 installed
1. Clone down this repo
1. `npm install` in the `svelte-project` directory

## Running svelte-check

To run the basic version, in the `svelte-project` folder, run:

```
$ npm run check

> svelte-project@0.0.1 check:with-exclude
> svelte-kit sync && svelte-check --tsconfig ./tsconfig-exclude.json


====================================
Loading svelte-check in workspace: /Users/blade/workspace/svelte-check-monorepo/svelte-project
Getting Svelte diagnostics...

/<absolute-path-here>/svelte-check-monorepo/svelte-project/../project-1/src/index.ts:1:10
Error: 'MyType' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled. 
import { MyType } from './types'



====================================
svelte-check found 1 error and 0 warnings in 1 file
```

If you try running a version of the check command that uses a tsconfig that explicitly tries to exclude the `project-1` directory, you get the same thing:

```
$ npm run check:with-exclude

> svelte-project@0.0.1 check:with-exclude
> svelte-kit sync && svelte-check --tsconfig ./tsconfig-exclude.json


====================================
Loading svelte-check in workspace: /Users/blade/workspace/svelte-check-monorepo/svelte-project
Getting Svelte diagnostics...

/<absolute-path-here>/svelte-check-monorepo/svelte-project/../project-1/src/index.ts:1:10
Error: 'MyType' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled. 
import { MyType } from './types'



====================================
svelte-check found 1 error and 0 warnings in 1 file
```

## Expectation

My expectation is that the separate `project-1` project, with it's own TSConfig, should not error, but I don't know how to configure the `svelte-check` command to skip checks for it or use the own project's tsconfig for evaluating it.