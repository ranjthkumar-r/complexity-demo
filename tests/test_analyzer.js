const assert = require('assert');
const Analyzer = require('../analyzer/analyzer');

const samples = [
  {code: 'function sum(a){ let s=0; for(let i=0;i<a.length;i++) s+=a[i]; return s; }', expect: 'O(n)'} ,
  {code: 'function fib(n){ if(n<2) return n; return fib(n-1)+fib(n-2); }', expect: 'O(2^n)'} ,
  {code: 'function bin(n){ if(n<2) return; return bin(Math.floor(n/2)); }', expect: 'O(log n)'} ,
  {code: `function mergeSort(a){ if(a.length<=1) return a; const m=Math.floor(a.length/2); const left=mergeSort(a.slice(0,m)); const right=mergeSort(a.slice(m)); return left.concat(right); }`, expect: 'O(n log n)'} ,
  {code: `function quickSort(a){ if(a.length<=1)return a; const p=a[Math.floor(a.length/2)]; const left=a.filter(x=>x<p), right=a.filter(x=>x>p); return quickSort(left).concat([p]).concat(quickSort(right)); }`, expect: 'O(n log n)'} ,
  {code: `function binarySearch(a, target){ let lo=0, hi=a.length-1; while(lo<=hi){ const mid=Math.floor((lo+hi)/2); if(a[mid]===target) return mid; if(a[mid]<target) lo=mid+1; else hi=mid-1; } return -1; }`, expect: 'O(log n)'} ,
  {code: `function countingSort(a, k){ const count = new Array(k).fill(0); for(let x of a) count[x]++; let res=[]; for(let i=0;i<count.length;i++){ while(count[i]--) res.push(i);} return res; }`, expect: 'O(n)'}
];

for(const s of samples){ const r = Analyzer.analyzeCode(s.code); console.log('code sample: ', s.expect, '=>', r.timeEstimate); assert(r.timeEstimate === s.expect, `Expected ${s.expect} but got ${r.timeEstimate}`); }
console.log('Analyzer tests passed.');