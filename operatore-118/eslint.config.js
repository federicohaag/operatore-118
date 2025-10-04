import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Enforce barrel exports for shared-state module
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/shared-state/store', '**/shared-state/hooks', '**/shared-state/sharedStateSlice', '**/shared-state/broadcastMiddleware', '**/shared-state/broadcastService'],
              message: 'Import from shared-state barrel export (index.ts) instead of direct file imports. Use: import { ... } from "../shared-state"'
            }
          ]
        }
      ]
    }
  },
])
