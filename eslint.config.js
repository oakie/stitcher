import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const files = ['**/*.{ts,tsx}'];

export default [
  { languageOptions: { globals: globals.browser }, files },
  ...tseslint.configs.recommended.map((x) => ({ ...x, files })),
  { ...pluginReact.configs.flat.recommended, files, rules: { 'react/react-in-jsx-scope': 'off' } },
];
