const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

// ProfileContent
code = code.replace(
  "export interface ProfileContent {",
  "export interface ProfileContent {\n  subtitle?: string;"
);

// Block
code = code.replace(
  "customDescFontSize?: number;",
  "customDescFontSize?: number;\n  customSubtitleFont?: string;\n  customSubtitleColor?: string;\n  customSubtitleFontSize?: number;\n  subtitleTextStyles?: TextStyles;"
);

fs.writeFileSync('src/types.ts', code);
console.log('Done types');
