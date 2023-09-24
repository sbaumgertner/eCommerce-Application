module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:prettier/recommended', 'prettier', 'plugin:@typescript-eslint/recommended', 'eslint:recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
        project: 'tsconfig.json',
    },
    plugins: ['prettier', '@typescript-eslint'],
    rules: {
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@tytypescript-eslint/no-inferrable-types': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/array-type': [
            'error',
            {
                accessibility: 'explicit',
                overrides: {
                    accessors: 'explicit',
                    constructors: 'off',
                    methods: 'explicit',
                    properties: 'explicit',
                    parameterProperties: 'explicit',
                },
            },
        ],
        'max-lines-per-function': ['error', 40],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
};
