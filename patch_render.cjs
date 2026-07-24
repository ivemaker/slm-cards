const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileBlockContent.tsx', 'utf8');

const target1 = `            {profile.name}
          </h2>
          {!isRow && (
            <p 
              className=\`text-xs opacity-85 leading-relaxed font-light whitespace-pre-line break-words max-w-full \${(block.descTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}\`
              style={{
                ...(block.customDescColor ? { color: block.customDescColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                ...(block.customDescFont ? { fontFamily: block.customDescFont } : {}),
                fontSize: block.customDescFontSize !== undefined ? \`\${block.customDescFontSize}px\` : undefined,
                ...getTextStyles(block, true, isPremium)
              }}
            >
              {profile.bio}
            </p>
          )}`;

const replacement1 = `            {profile.name}
          </h2>
          {profile.subtitle && (
            <h3 
              className=\`opacity-90 font-medium \${(block.subtitleTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}\`
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
            <p 
              className=\`text-xs opacity-85 leading-relaxed font-light whitespace-pre-line break-words max-w-full \${(block.descTextStyles?.textShimmerEnabled || block.textShimmerEnabled) ? 'text-shimmer-effect' : ''}\`
              style={{
                ...(block.customDescColor ? { color: block.customDescColor } : block.customTextColor ? { color: block.customTextColor } : {}),
                ...(block.customDescFont ? { fontFamily: block.customDescFont } : {}),
                fontSize: block.customDescFontSize !== undefined ? \`\${block.customDescFontSize}px\` : undefined,
                ...getTextStyles(block, true, isPremium)
              }}
            >
              {profile.bio}
            </p>
          )}`;

code = code.replace(target1, replacement1);
fs.writeFileSync('src/components/ProfileBlockContent.tsx', code);
console.log('Done rendering subtitle');
