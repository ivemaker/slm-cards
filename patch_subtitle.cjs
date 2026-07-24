const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileBlockContent.tsx', 'utf8');

const target = `          </h2>
          {!isRow && (
            <p `;

const replacement = `          </h2>
          {profile.subtitle && (
            <h3 
              className={\`opacity-90 font-medium \${(block.subtitleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}\`}
              style={{
                ...(block.customSubtitleColor ? { color: block.customSubtitleColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                ...(block.customSubtitleFont ? { fontFamily: block.customSubtitleFont } : {}),
                fontSize: block.customSubtitleFontSize !== undefined ? \`\${block.customSubtitleFontSize}px\` : '14px',
                ...(block.subtitleTextStyles?.textBold ? { fontWeight: 'bold' } : {}),
                ...(block.subtitleTextStyles?.textItalic ? { fontStyle: 'italic' } : {}),
                ...(block.subtitleTextStyles?.textUnderline ? { textDecoration: 'underline' } : {}),
                ...(block.subtitleTextStyles?.textLineHeight ? { lineHeight: block.subtitleTextStyles.textLineHeight } : {}),
                ...(block.subtitleTextStyles?.textLetterSpacing ? { letterSpacing: \`\${block.subtitleTextStyles.textLetterSpacing}px\` } : {}),
                ...(block.subtitleTextStyles?.textTransform ? { textTransform: block.subtitleTextStyles.textTransform } : {}),
                ...(block.subtitleTextStyles?.textAlign ? { textAlign: block.subtitleTextStyles.textAlign } : {}),
              }}
            >
              {profile.subtitle}
            </h3>
          )}
          {!isRow && (
            <p `;

code = code.replace(target, replacement);

const target2 = `      {isRow && profile.bio && (
        <p `;

const replacement2 = `      {isRow && profile.subtitle && (
        <h3 
          className={\`opacity-90 font-medium \${(block.subtitleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}\`}
          style={{
            ...(block.customSubtitleColor ? { color: block.customSubtitleColor } : block.customTextColor ? { color: block.customTextColor } : {}),
            ...(block.customSubtitleFont ? { fontFamily: block.customSubtitleFont } : {}),
            fontSize: block.customSubtitleFontSize !== undefined ? \`\${block.customSubtitleFontSize}px\` : '14px',
            ...(block.subtitleTextStyles?.textBold ? { fontWeight: 'bold' } : {}),
            ...(block.subtitleTextStyles?.textItalic ? { fontStyle: 'italic' } : {}),
            ...(block.subtitleTextStyles?.textUnderline ? { textDecoration: 'underline' } : {}),
            ...(block.subtitleTextStyles?.textLineHeight ? { lineHeight: block.subtitleTextStyles.textLineHeight } : {}),
            ...(block.subtitleTextStyles?.textLetterSpacing ? { letterSpacing: \`\${block.subtitleTextStyles.textLetterSpacing}px\` } : {}),
            ...(block.subtitleTextStyles?.textTransform ? { textTransform: block.subtitleTextStyles.textTransform } : {}),
            ...(block.subtitleTextStyles?.textAlign ? { textAlign: block.subtitleTextStyles.textAlign } : {}),
          }}
        >
          {profile.subtitle}
        </h3>
      )}
      {isRow && profile.bio && (
        <p `;
code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/ProfileBlockContent.tsx', code);
console.log('done replacing');
