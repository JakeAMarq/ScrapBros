module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "quotes": ["error", "single"],
        "no-magic-numbers": [
            "error",
            { "ignore": [-1, 0, 1, 2, 1000], "ignoreArrayIndexes": true }
        ]
    }
};