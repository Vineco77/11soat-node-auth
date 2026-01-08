const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building auth-lib...');

if (fs.existsSync('./dist')) {
  fs.rmSync('./dist', { recursive: true });
}

execSync('npx tsc', { stdio: 'inherit' });

fs.copyFileSync('./package.json', './dist/package.json');

console.log('✅ auth-lib built successfully!');