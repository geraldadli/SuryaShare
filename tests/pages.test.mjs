import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

test('Pages publishes the simulation without deployment tools or local configuration', () => {
  const build = spawnSync(process.execPath, ['scripts/build-pages.mjs'], { encoding: 'utf8' });
  assert.equal(build.status, 0, build.stdout + build.stderr);
  for (const entry of ['index.html']) {
    const html = readFileSync(`dist/${entry}`, 'utf8');
    for (const match of html.matchAll(/(?:src|href)="(\/[^\"]+)"/g)) {
      assert.ok(match[1].startsWith('/SuryaShare/'), `Wrong Pages base: ${match[1]}`);
      assert.ok(existsSync(`dist/${match[1].slice('/SuryaShare/'.length)}`), `Missing asset: ${match[1]}`);
    }
  }
  assert.equal(existsSync('dist/deployment.json'), false);
  assert.equal(existsSync('dist/deploy.html'), false);
  const invalid = spawnSync(process.execPath, ['scripts/connect-sepolia.mjs', 'not-a-transaction'], { encoding: 'utf8' });
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /deployment transaction hash/);
});
