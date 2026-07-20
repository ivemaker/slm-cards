const fs = require('fs');
const file = 'node_modules/react/cjs/react-jsx-dev-runtime.development.js';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  /console\.error\(\s*'Each child in a list should have a unique "key" prop\..*?\);/s,
  `$&
  console.error(">>> MISSING KEY AT:", new Error().stack);`
);
fs.writeFileSync(file, code);
