module.exports = {
  // TypeScript/JavaScript files
  '**/*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JSON, Markdown, YAML files
  '**/*.{json,md,yml,yaml}': [
    'prettier --write',
  ],
  
  // Run type check on TypeScript files
  '**/*.{ts,tsx}': () => 'tsc --noEmit',
}
