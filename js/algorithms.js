export const algorithms = [
  {
    id: "binary-search",
    name: "Binary Search",
    category: "Searching",
    desc: "Efficiently finds an item in a sorted list by repeatedly dividing the search interval in half.",
    details: `
      <p>Binary Search is one of the most fundamental and efficient algorithms in computer science. It works on the principle of <strong>Divide and Conquer</strong>.</p>
      
      <h4>How it Works</h4>
      <p>Instead of checking every element one by one (like Linear Search), Binary Search compares the target value to the middle element of the array:</p>
      <ul>
        <li>If they match, you're done!</li>
        <li>If the target is smaller, the search continues in the <em>lower</em> half.</li>
        <li>If the target is larger, the search continues in the <em>upper</em> half.</li>
      </ul>
      <p>This process repeats until the item is found or the search interval becomes empty.</p>

      <h4>Real-World Analogy</h4>
      <p>Imagine looking for a word in a dictionary. You don't read every word from the first page. You open the book to the middle. If the word you're looking for comes alphabetically before the page you opened, you ignore the entire second half of the book and repeat the process with the first half.</p>

      <h4>Complexity Analysis</h4>
      <ul>
        <li><strong>Time: O(log n)</strong> - Because the search space is cut in half at every step, the number of steps grows logarithmically with the input size. For 1,000,000 items, it takes only ~20 steps!</li>
        <li><strong>Space: O(1)</strong> - It only requires a few variables (pointers) to keep track of the range, so it uses constant extra space.</li>
      </ul>
    `,
    time: { best: "O(1)", avg: "O(log n)", worst: "O(log n)" },
    space: "O(1)",
    complexityFunction: "logn",
    code: `/**
 * Binary Search
 * @param {number[]} arr - A sorted array of numbers
 * @param {number} target - The number to search for
 * @returns {number} - The index of the target, or -1 if not found
 */
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Calculate middle index
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // Found it!
    } 
    
    if (arr[mid] < target) {
      // Target is in the right half
      left = mid + 1;
    } else {
      // Target is in the left half
      right = mid - 1;
    }
  }

  return -1; // Not found
}`
  },
  {
    id: "linear-search",
    name: "Linear Search",
    category: "Searching",
    desc: "The simplest search algorithm: checks every element until the target is found.",
    details: `
      <p>Linear Search is the most basic searching algorithm. It sequentially checks each element of the list until a match is found or the whole list has been searched.</p>
      
      <h4>When to Use</h4>
      <ul>
        <li>When the list is small.</li>
        <li>When the list is <strong>unsorted</strong> (Binary Search requires sorting first).</li>
      </ul>

      <h4>Complexity Analysis</h4>
      <ul>
        <li><strong>Time: O(n)</strong> - In the worst case (item is at the end or not present), you must check every single n element.</li>
        <li><strong>Space: O(1)</strong> - No extra memory is needed.</li>
      </ul>
    `,
    time: { best: "O(1)", avg: "O(n)", worst: "O(n)" },
    space: "O(1)",
    complexityFunction: "n",
    code: `/**
 * Linear Search
 * @param {number[]} arr - An array of numbers
 * @param {number} target - The number to search for
 * @returns {number} - The index of the target, or -1 if not found
 */
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`
  },
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting",
    desc: "A simple sorting algorithm that repeatedly steps through the list, comparing adjacent elements and swapping them.",
    details: `
      <p>Bubble Sort is often the first sorting algorithm taught because of its conceptual simplicity. It behaves like bubbles rising to the surface: larger elements 'bubble up' to the end of the list with each pass.</p>
      
      <h4>Mechanism</h4>
      <p>The algorithm iterates through the list multiple times. In each pass, it compares adjacent items (i and i+1). If they are out of order, it swaps them. This repeats until no swaps are needed.</p>

      <h4>Drawbacks</h4>
      <p>It is generally <strong>very inefficient</strong> for large lists compared to algorithms like QuickSort or MergeSort.</p>

      <h4>Complexity Analysis</h4>
      <ul>
        <li><strong>Time: O(n²)</strong> - Nested loops are required to ensure every element is checked against every other element in the worst case.</li>
        <li><strong>Space: O(1)</strong> - Swapping is done in-place.</li>
      </ul>
    `,
    time: { best: "O(n)", avg: "O(n^2)", worst: "O(n^2)" },
    space: "O(1)",
    complexityFunction: "n2",
    code: `/**
 * Bubble Sort
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - The sorted array
 */
function bubbleSort(arr) {
  const len = arr.length;
  let swapped;
  
  do {
    swapped = false;
    for (let i = 0; i < len - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
  } while (swapped);
  
  return arr;
}`
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "Sorting",
    desc: "Builds a sorted array one item at a time, similar to sorting playing cards in your hand.",
    details: `
      <p>Insertion Sort is efficient for small data sets or data sets that are already substantially sorted. It works by taking an element from the unsorted portion and inserting it into the correct position in the sorted portion.</p>
      
      <h4>Real-World Analogy</h4>
      <p>Think of how you sort cards in your hand. You pick up a card, look at the sorted cards you already hold, and slide the new card in between the two cards where it fits.</p>

      <h4>Complexity Analysis</h4>
      <ul>
        <li><strong>Time: O(n²)</strong> - In the worst case (reverse sorted), for each element, you might have to shift all previous elements.</li>
        <li><strong>Space: O(1)</strong> - Sorts in-place.</li>
      </ul>
    `,
    time: { best: "O(n)", avg: "O(n^2)", worst: "O(n^2)" },
    space: "O(1)",
    complexityFunction: "n2",
    code: `/**
 * Insertion Sort
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - The sorted array
 */
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    // Current element to value
    let current = arr[i];
    let j = i - 1;

    // Shift elements greater than current to the right
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert current element
    arr[j + 1] = current;
  }
  return arr;
}`
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "Sorting",
    desc: "A stable, efficient, divide-and-conquer sorting algorithm.",
    details: `
      <p>Merge Sort represents a significant step up in efficiency. It recursively splits the array into halves until it has n arrays of 1 element, then it systematically <strong>merges</strong> these sub-arrays back together in sorted order.</p>

      <h4>Key Feature: Stability</h4>
      <p>Merge Sort is stable, meaning it preserves the relative order of equal elements. This is crucial in many real-world database applications.</p>

      <h4>Complexity Analysis</h4>
      <ul>
        <li><strong>Time: O(n log n)</strong> - The array is split log(n) times, and the merging takes linear time n at each level. This is guaranteed for all cases (Best, Avg, Worst).</li>
        <li><strong>Space: O(n)</strong> - Unlike Bubble or Insertion sort, Merge Sort typically requires auxiliary space to hold the sub-arrays during merging.</li>
      </ul>
    `,
    time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
    space: "O(n)",
    complexityFunction: "nlogn",
    code: `/**
 * Merge Sort
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - The sorted array
 */
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

// Helper to merge two sorted arrays
function merge(left, right) {
  let result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "Sorting",
    desc: "One of the most popular and efficient sorting algorithms, using partitioning around a pivot.",
    details: `
      <p>Quick Sort is the industry standard for generic sorting (e.g., typically used in C++ STL sort or JS engines). It works by selecting a 'pivot' element and partitioning the array so that all smaller elements are on the left and larger ones on the right.</p>

      <h4>Performance</h4>
      <p>While its worst-case scenario is O(n²), in practice it is often faster than Merge Sort because it can be done in-place and has good cache locality.</p>

      <h4>Complexity Analysis</h4>
      <ul>
        <li><strong>Time: O(n log n)</strong> (Average) - Like Merge Sort, it divides the problem.</li>
        <li><strong>Space: O(log n)</strong> - Stack space for recursion.</li>
      </ul>
    `,
    time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n^2)" },
    space: "O(log n)",
    complexityFunction: "nlogn",
    code: `/**
 * Quick Sort
 * @param {number[]} arr - Array to sort
 * @returns {number[]} - The sorted array
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}`
  },
  {
    id: "bfs-dfs",
    name: "BFS / DFS",
    category: "Graph",
    desc: "Fundamental algorithms for visiting nodes in a graph or tree: Breadth-First vs Depth-First.",
    details: `
      <p>These are the two main ways to traverse a graph:</p>
      <ul>
        <li><strong>BFS (Breadth-First Search)</strong>: Explores neighbors layer by layer. Like a ripple in a pond. Good for finding the shortest path in unweighted graphs. Uses a <strong>Queue</strong>.</li>
        <li><strong>DFS (Depth-First Search)</strong>: Explores as far as possible along each branch before backtracking. Like solving a maze. Uses a <strong>Stack</strong> (or recursion).</li>
      </ul>

      <h4>Complexity Analysis</h4>
      <ul>
        <li><strong>Time: O(V + E)</strong> - You visit every Vertex (V) and every Edge (E) once.</li>
        <li><strong>Space: O(V)</strong> - To store the visited set and the Queue/Stack.</li>
      </ul>
    `,
    time: { best: "O(V + E)", avg: "O(V + E)", worst: "O(V + E)" },
    space: "O(V)",
    complexityFunction: "vplusE",
    code: `/* 
 Assume graph is an Adjacency List:
 const graph = {
   'A': ['B', 'C'],
   'B': ['D', 'E'],
   ...
 }
*/

function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  const result = [];

  while (queue.length > 0) {
    const node = queue.shift(); // Dequeue
    result.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}

function dfs(graph, start, visited = new Set()) {
  console.log(start);
  visited.add(start);

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Graph",
    desc: "Finds the shortest paths between nodes in a graph, which may represent, for example, road networks.",
    details: `
      <p>Dijkstra's algorithm is the gold standard for finding the shortest path in a graph with non-negative edge weights. It is widely used in GPS navigation systems.</p>

      <h4>Mechanism</h4>
      <p>It uses a "Priority Queue" to always explore the closest unvisited node next. It maintains a running list of the shortest known distance to every node from the start.</p>

      <h4>Complexity Analysis</h4>
      <ul>
        <li><strong>Time: O((V + E) log V)</strong> - The log V factor comes from the Priority Queue operations.</li>
      </ul>
    `,
    time: { best: "O(E log V)", avg: "O(E log V)", worst: "O(E log V)" },
    space: "O(V)",
    complexityFunction: "vplusE",
    code: `// Conceptual Implementation
// Requires a PriorityQueue class for O(log n) efficiency

function dijkstra(graph, start) {
  const distances = {};
  const pq = new PriorityQueue();
  
  // Init
  for (let node in graph) distances[node] = Infinity;
  distances[start] = 0;
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const { node: u, priority: d } = pq.dequeue();

    if (d > distances[u]) continue;

    for (let neighbor in graph[u]) {
      const weight = graph[u][neighbor];
      const newDist = d + weight;
      
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.enqueue(neighbor, newDist);
      }
    }
  }
  return distances;
}`
  }
];
