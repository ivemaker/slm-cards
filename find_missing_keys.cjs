const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Simple regex to find map returning a JSX tag without a key
  // This is naive but might catch it
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('.map(')) {
      for (let j = i; j < Math.min(i + 5, lines.length); j++) {
        const match = lines[j].match(/<([a-zA-Z]+)([^>]*?)>/);
        if (match && !match[0].includes('key=') && !match[0].includes('</')) {
           // check if key is on the next line
           let hasKey = false;
           for (let k = j; k < Math.min(j + 3, lines.length); k++) {
             if (lines[k].includes('key=')) {
               hasKey = true;
               break;
             }
           }
           if (!hasKey) {
             console.log(`Possible missing key in ${filePath} at line ${j + 1}: ${lines[j]}`);
           }
           break; // Stop after the first tag
        }
      }
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      checkFile(fullPath);
    }
  }
}

walkDir('./src');
