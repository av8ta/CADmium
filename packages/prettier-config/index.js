module.exports = {
  singleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  arrowParens: "always",
  useTabs: true,
  tabWidth: 2,
  printWidth: 120,
  semi: false,
  plugins: ["prettier-plugin-svelte"],
  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte",
      },
    },
  ],
}
