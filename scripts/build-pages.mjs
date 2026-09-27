import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--base=/SuryaShare/', '--mode=pages'], {
  stdio: 'inherit',
});
if (result.status !== 0) process.exit(result.status ?? 1);
// Never publish a developer's loopback deployment to the public website.
rmSync('dist/deployment.json', { force: true });
console.log('Browser simulation ready for GitHub Pages.');
