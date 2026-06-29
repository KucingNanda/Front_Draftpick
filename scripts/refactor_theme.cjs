const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// These regex replacements target only class strings.
const replacements = [
  // Backgrounds
  { regex: /bg-\[\#0f172a\]/g, replacement: 'bg-gray-50 dark:bg-[#0f172a]' },
  { regex: /bg-gray-900/g, replacement: 'bg-gray-100 dark:bg-gray-900' },
  { regex: /bg-gray-800/g, replacement: 'bg-white dark:bg-gray-800' },
  { regex: /bg-gray-700/g, replacement: 'bg-gray-200 dark:bg-gray-700' },
  { regex: /bg-gray-950/g, replacement: 'bg-gray-200 dark:bg-gray-950' },
  { regex: /bg-\[\#1e293b\]/g, replacement: 'bg-white dark:bg-[#1e293b]' },

  // Borders
  { regex: /border-gray-700/g, replacement: 'border-gray-200 dark:border-gray-700' },
  { regex: /border-gray-800/g, replacement: 'border-gray-300 dark:border-gray-800' },
  { regex: /border-gray-600/g, replacement: 'border-gray-300 dark:border-gray-600' },

  // Texts
  { regex: /text-gray-400/g, replacement: 'text-gray-500 dark:text-gray-400' },
  { regex: /text-gray-300/g, replacement: 'text-gray-600 dark:text-gray-300' },
  { regex: /text-gray-200/g, replacement: 'text-gray-700 dark:text-gray-200' },
  { regex: /text-gray-500/g, replacement: 'text-gray-400 dark:text-gray-500' },
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      // skip MainLayout since we already modified it perfectly
      if (fullPath.includes('MainLayout.jsx')) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // avoid re-replacing if the script is run multiple times
      if (!content.includes('dark:bg-gray-800') && !content.includes('dark:bg-gray-900')) {
        replacements.forEach(({ regex, replacement }) => {
          content = content.replace(regex, replacement);
        });

        // Safe replacement for text-white:
        // Instead of blanket replace which breaks buttons (e.g. `bg-blue-600 text-white`),
        // we'll replace text-white only where it's likely a primary text color (like headings/cards)
        // Since we can't reliably parse AST, we just look for text-white and replace it if it's NOT inside a button.
        // Wait, a simpler way is just regex: replace `text-white` with `text-gray-900 dark:text-white`
        // EXCEPT if preceded by `bg-[a-z]+-\d00`
        // To be safe, I'll do this manually for `text-white` in files if it breaks buttons.
        // Actually, we can just replace text-white with text-gray-900 dark:text-white and let standard buttons keep text-white explicitly if they use hover, but standard buttons like bg-blue-600 need text-white.
        // For now, let's leave `text-white` untouched by script and only handle it manually where it's a heading.
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(srcDir);
console.log('Done refactoring theme classes!');
