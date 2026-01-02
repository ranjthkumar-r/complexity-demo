export const algorithms = [
  {
    id: "binary-search",
    name: "Binary Search",
    category: "Searching",
    desc: "Searches a sorted array by repeatedly dividing the search interval in half.",
    time: { best: "O(1)", avg: "O(log n)", worst: "O(log n)" },
    space: "O(1)",
    complexityFunction: "logn",
    code: `function binarySearch(arr, target){
  let lo=0, hi=arr.length-1;
  while(lo<=hi){
    const mid=Math.floor((lo+hi)/2);
    if(arr[mid]===target) return mid;
    if(arr[mid]<target) lo = mid+1; else hi = mid-1;
  }
  return -1;
}`
  },
  {
    id: "linear-search",
    name: "Linear Search",
    category: "Searching",
    desc: "Scan each element until you find the target.",
    time: { best: "O(1)", avg: "O(n)", worst: "O(n)" },
    space: "O(1)",
    complexityFunction: "n",
    code: `function linearSearch(arr, target){
  for(let i=0;i<arr.length;i++) if(arr[i]===target) return i;
  return -1;
}`
  },
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting",
    desc: "Repeatedly swap adjacent elements if they are in the wrong order.",
    time: { best: "O(n)", avg: "O(n^2)", worst: "O(n^2)" },
    space: "O(1)",
    complexityFunction: "n2",
    code: `function bubbleSort(a){
  for(let i=0;i<a.length;i++) for(let j=0;j<a.length-1-i;j++) if(a[j]>a[j+1]) [a[j],a[j+1]]=[a[j+1],a[j]];
  return a;
}`
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "Sorting",
    desc: "Build a sorted array one item at a time by insertion.",
    time: { best: "O(n)", avg: "O(n^2)", worst: "O(n^2)" },
    space: "O(1)",
    complexityFunction: "n2",
    code: `function insertionSort(a){
  for(let i=1;i<a.length;i++){
    let key=a[i], j=i-1; while(j>=0 && a[j]>key){a[j+1]=a[j]; j--;} a[j+1]=key;
  } return a;
}`
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "Sorting",
    desc: "Divide the array, sort each half, and merge.",
    time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
    space: "O(n)",
    complexityFunction: "nlogn",
    code: `function mergeSort(a){ 
  if(a.length<=1) return a; 
  const m=Math.floor(a.length/2); 
  return merge(mergeSort(a.slice(0,m)),mergeSort(a.slice(m))); 
}`
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "Sorting",
    desc: "Divide and conquer using a pivot; average O(n log n), worst O(n^2) with bad pivots.",
    time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n^2)" },
    space: "O(log n)",
    complexityFunction: "nlogn",
    code: `function quickSort(a){ 
  if(a.length<=1)return a; 
  const p=a[Math.floor(a.length/2)]; 
  const left=a.filter(x=>x<p), right=a.filter(x=>x>p), mid=a.filter(x=>x===p); 
  return quickSort(left).concat(mid).concat(quickSort(right)); 
}`
  },
  {
    id: "hash-table",
    name: "Hash Table",
    category: "Data Structure",
    desc: "Average O(1) for insert/search/delete when load factor is controlled.",
    time: { best: "O(1)", avg: "O(1)", worst: "O(n)" },
    space: "O(n)",
    complexityFunction: "1",
    code: "// Conceptual: use a hash map provided by the language (e.g., Object/Map)"
  },
  {
    id: "bfs-dfs",
    name: "BFS / DFS",
    category: "Graph",
    desc: "Graph traversals that visit each vertex and edge once.",
    time: { best: "O(V + E)", avg: "O(V + E)", worst: "O(V + E)" },
    space: "O(V)",
    complexityFunction: "vplusE",
    code: `function bfs(adj, start){ 
  const q=[start], vis=new Set([start]); 
  while(q.length){ 
    const u=q.shift(); 
    for(const v of adj[u]) if(!vis.has(v)){vis.add(v); q.push(v);} 
  } 
}`
  },
  {
    id: "naive-fib",
    name: "Naive Fibonacci",
    category: "Recursion",
    desc: "Naive recursion computes many overlapping subproblems -> exponential time.",
    time: { best: "O(1)", avg: "O(2^n)", worst: "O(2^n)" },
    space: "O(n)",
    complexityFunction: "2powern",
    code: `function fib(n){ if(n<2) return n; return fib(n-1)+fib(n-2); }`
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Graph",
    desc: "Shortest paths from a single source using a priority queue.",
    time: { best: "O((V+E) log V)", avg: "O((V+E) log V)", worst: "O((V+E) log V)" },
    space: "O(V)",
    complexityFunction: "vplusE",
    code: `function dijkstra(graph, src){ /* uses priority queue */ }`
  }
];
