module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-param-reassign': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true },
    ],
    'no-underscore-dangle': 'off',
    'max-len': ['error', { code: 200 }],
    camelcase: 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'arrow-body-style': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'no-extra-semi': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    'no-trailing-spaces': 'warn',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          '{}': false,
        },
        extendDefaults: true,
      },
    ],
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    'max-classes-per-file': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
    'eol-last': ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'comma-spacing': ['error', { before: false, after: true }],
    'no-multi-spaces': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
