import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.resolve('node_modules/blackwall/dist/blackwall');
const destDir = path.resolve('static/vendor/blackwall');

fs.mkdirSync(destDir, { recursive: true });

for (const entry of fs.readdirSync(srcDir)) {
  const src = path.join(srcDir, entry);
  const dest = path.join(destDir, entry);
  fs.copyFileSync(src, dest);
}

console.log(`Copied Blackwall static bundle to ${destDir}`);
