import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';
import { readFileSync } from 'fs';

// implement our own nx workspace project resolution.
const PROJECT_ROOT = path.resolve('..');
const workspaceFile = readFileSync(
  path.join(PROJECT_ROOT, 'tsconfig.base.json')
).toString('utf8');
const workspaceProjects = JSON.parse(workspaceFile).compilerOptions.paths;
function workspaceResolver(alias: string) {
  if (!workspaceProjects[alias]) return '';
  const resolvedPath = path.resolve(PROJECT_ROOT, workspaceProjects[alias][0]);
  return resolvedPath;
}

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: [
			{
				find: '@project',
				replacement: '@project',
				customResolver: workspaceResolver
			}
		]
	}
});
