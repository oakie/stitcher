import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const files = ['**/*.{ts,tsx}'];

export default [
  { languageOptions: { globals: globals.browser }, files },
  ...tseslint.configs.recommended.map((x) => ({ ...x, files })),
  { ...eslintReact.configs['recommended-typescript'], files },
];
