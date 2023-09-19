module.exports = {
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es2021: true,
    },
    overrides: [],
    parserOptions: {
        ecmaVersion: 2022,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        '@typescript-eslint/no-unused-vars': 'off',
    },
    globals: {
        io: 'readonly',
        logger: 'readonly',
        error: 'readonly',
        enums: 'readonly',
        eventBus: 'readonly',
        softError: 'readonly',
        hardError: 'readonly',
    },
};
