import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../tsconfig.base.json'), 'utf-8')
);

Object.entries(baseConfig.compilerOptions.paths).forEach(([alias, paths]) => {
  baseConfig.compilerOptions.paths[alias] = paths.map((p) =>
    p
      .replace('project-1', '../../project-1')
  );
});


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		typescript: {
			config: (config) => {
			  config.compilerOptions.paths = {
				...baseConfig.compilerOptions.paths,
				...config.compilerOptions.paths,
			  };
			  return config;
			},
		  },
	}
};

export default config;
