import { readFileSync } from 'fs';

const en = JSON.parse(readFileSync('messages/en.json', 'utf8'));
const da = JSON.parse(readFileSync('messages/da.json', 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k], path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

const enKeys = new Set(getKeys(en));
const daKeys = new Set(getKeys(da));
const missingInDa = [...enKeys].filter(k => !daKeys.has(k));
const missingInEn = [...daKeys].filter(k => !enKeys.has(k));

if (missingInDa.length || missingInEn.length) {
  if (missingInDa.length) {
    console.error(`Missing in DA (${missingInDa.length}):`);
    missingInDa.forEach(k => console.error(`  - ${k}`));
  }
  if (missingInEn.length) {
    console.error(`Missing in EN (${missingInEn.length}):`);
    missingInEn.forEach(k => console.error(`  - ${k}`));
  }
  process.exit(1);
}

console.log(`Translation check passed: ${enKeys.size} EN keys, ${daKeys.size} DA keys — perfect parity`);
