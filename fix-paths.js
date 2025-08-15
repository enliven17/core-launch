const fs = require('fs');
const path = require('path');

// Fix absolute paths in all TypeScript/JavaScript files
function fixPathsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace @/ imports with relative paths
    const importRegex = /from ['"]@\/([^'"]+)['"]/g;
    content = content.replace(importRegex, (match, importPath) => {
      const currentDir = path.dirname(filePath);
      const targetPath = path.join('src', importPath);
      const relativePath = path.relative(currentDir, targetPath);
      
      // Ensure path starts with ./
      const finalPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
      console.log(`  ${match} → from '${finalPath}'`);
      
      modified = true;
      return `from '${finalPath}'`;
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed paths in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      console.log(`🔍 Processing: ${filePath}`);
      fixPathsInFile(filePath);
    }
  });
}

console.log('🚀 Starting path fix...');
processDirectory('.');
console.log('✅ Path fix completed!');
