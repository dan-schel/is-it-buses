import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import custom from "./scripts/eslint/index.js";

// Philosophy: Reserve errors for situations where the code will not run or
// compile. Everything else is a warning. Warnings will still cause CI to fail,
// but let the dev get away with trying something temporarily without the editor
// putting red squigglies all over the place.

const customRules = {
  plugins: {
    custom,
  },
  rules: {
    // Ignore unused variables if they start with underscores.
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    // Require === and !==, except when comparing to null.
    eqeqeq: ["warn", "always", { null: "ignore" }],

    // Warn on console.log uses, but allow console.warn.
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // Warn about prettier violations.
    "prettier/prettier": "warn",

    // Warn if <Thing></Thing> can be changed to <Thing />.
    "react/self-closing-comp": "warn",

    // Ensure return type of +data hooks checks against JsonSerializable.
    "custom/ensure-data-serializable": "warn",

    // Ban relative imports, and require paths to start with "@/" instead.
    "custom/enforce-import-alias": "warn",

    // Ban imports from "@/server/entry-point" in non-entry-point files.
    "custom/prevent-entry-point-imports": "warn",

    // Ban imports from "@/server" in frontend files (excluding +data).
    "custom/prevent-server-imports-in-frontend": "warn",

    // TODO: Consider other lint rules from
    // https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#list-of-supported-rules
    // such as `react/button-has-type`.
  },
};

const reactConfig = [
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...react,
    languageOptions: {
      ...react.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "react-hooks": reactHooks,
    },

    // Ignore use of Vike hooks inside Vike's "+" files (this plugin thinks
    // anything starting with "use" is a React hook)
    ignores: ["**/+*.ts"],

    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default tseslint.config(
  {
    ignores: ["node_modules/*", "dist/*", "coverage/*", "components/icons/*"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // TODO: [DS] Switch to using this.
  // ...tseslint.configs.recommendedTypeChecked,
  // {
  //   languageOptions: {
  //     parserOptions: {
  //       projectService: true,
  //       tsconfigRootDir: import.meta.dirname,
  //     },
  //   },
  // },

  reactConfig,
  prettier,
  customRules,
);
