import { existsSync, readFileSync, copyFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { compile } from './compile.mjs';

compile();
const configPath = 'deployments/sepolia.json';
const connected = existsSync(configPath);
if (connected) {
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (config.chainId !== 11155111 || !/^0x[\da-f]{40}$/i.test(config.address) || new URL(config.rpcUrl).protocol !== 'https:') {
    throw new Error('Pages requires a Sepolia contract and HTTPS RPC.');
  }
}
const result = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--base=/SuryaShare/', '--mode=pages'], {
  stdio: 'inherit', env: { ...process.env, VITE_PUBLIC_TESTNET: String(connected) },
});
if (result.status !== 0) process.exit(result.status ?? 1);
// Never publish a developer's loopback deployment to the public website.
if (connected) copyFileSync(configPath, 'dist/deployment.json');
else rmSync('dist/deployment.json', { force: true });
console.log(connected ? 'Pages connected to Sepolia.' : 'Pages preview + browser deployment page ready.');
