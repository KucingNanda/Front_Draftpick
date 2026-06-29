const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const replacements = [
  // Gradients
  { regex: /from-gray-900/g, replacement: 'from-slate-200 dark:from-gray-900' },
  { regex: /via-gray-900/g, replacement: 'via-slate-200 dark:via-gray-900' },
  { regex: /to-gray-900/g, replacement: 'to-slate-200 dark:to-gray-900' },
  
  { regex: /from-gray-800/g, replacement: 'from-slate-100 dark:from-gray-800' },
  { regex: /via-gray-800/g, replacement: 'via-slate-100 dark:via-gray-800' },
  { regex: /to-gray-800/g, replacement: 'to-slate-100 dark:to-gray-800' },

  { regex: /from-gray-700/g, replacement: 'from-slate-300 dark:from-gray-700' },
  { regex: /via-gray-700/g, replacement: 'via-slate-300 dark:via-gray-700' },
  { regex: /to-gray-700/g, replacement: 'to-slate-300 dark:to-gray-700' },

  // Any raw text-white that were skipped inside certain elements
  // We should make sure `text-white` without dark: gets converted where appropriate
  // But actually the text invisibility is primarily due to backgrounds staying dark (like gradients).
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      replacements.forEach(({ regex, replacement }) => {
        // Prevent double replacement
        if (!content.includes('dark:' + replacement.split('dark:')[1])) {
           content = content.replace(regex, replacement);
        }
      });
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(srcDir);
console.log('Fixed gradients for light mode!');
