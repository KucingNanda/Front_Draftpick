const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We want to replace text-white with text-gray-900 dark:text-white
      // But we MUST NOT replace it if it's on a button or badge that has bg-blue-*, bg-emerald-*, bg-red-*, etc.
      // We can use a regex that matches `text-white` but only if it's NOT inside a className string that contains bg-{color}-500 or bg-{color}-600.
      // A simpler heuristic: just replace `text-white` -> `text-gray-900 dark:text-white`. 
      // Then explicitly restore text-white for buttons like:
      // bg-blue-600 text-gray-900 dark:text-white -> bg-blue-600 text-white
      // bg-red-500 text-gray-900 dark:text-white -> bg-red-500 text-white
      // bg-emerald-600 text-gray-900 dark:text-white -> bg-emerald-600 text-white

      if (!content.includes('dark:text-white') && content.includes('text-white')) {
        content = content.replace(/text-white/g, 'text-gray-900 dark:text-white');
        
        // Restore common colored elements
        const colorRegex = /(bg-(?:blue|red|green|emerald|yellow|purple|pink|indigo)-[4567]00[^"']*?)text-gray-900 dark:text-white/g;
        content = content.replace(colorRegex, '$1text-white');

        // Restore if text-white is before the background class
        const colorRegex2 = /text-gray-900 dark:text-white([^"']*?bg-(?:blue|red|green|emerald|yellow|purple|pink|indigo)-[4567]00)/g;
        content = content.replace(colorRegex2, 'text-white$1');
        
        // For buttons that might have multiple classes in between
        content = content.replace(/(bg-gradient-to-[a-z]+ from-[a-z]+-[4567]00[^"']*?)text-gray-900 dark:text-white/g, '$1text-white');

        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDir(srcDir);
console.log('Fixed text-white!');
