const fs = require('fs');
const assert = require('assert');
const validKeys = new Set(['1','logn','n','nlogn','n2','n3','2powern','vplusE']);
const data = JSON.parse(fs.readFileSync('./data/algorithms.json','utf8'));
assert(Array.isArray(data), 'algorithms.json must be an array');
for(const a of data){
  assert(a.id && typeof a.id==='string', 'id required');
  assert(a.name && typeof a.name==='string', 'name required');
  assert(a.time && typeof a.time==='object', 'time object required');
  assert(a.space && typeof a.space==='string', 'space required');
  if(a.complexityFunction) {
    // allow functions to be like 'n', 'nlogn', or 'vplusE'
    const key = a.complexityFunction;
    // allow some variations like 'n' or 'n2', but check base
    const base = key.replace(/[^a-z0-9]/gi,'');
    assert(validKeys.has(base), `unknown complexityFunction ${key} for ${a.id}`);
  }
}
console.log('All JSON checks passed.');
