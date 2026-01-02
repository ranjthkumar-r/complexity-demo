// Simple heuristic JS complexity analyzer using Esprima AST
(function(root){
  const esprima = (typeof require !== 'undefined') ? require('esprima') : window.esprima;

  function walk(node, enter){
    if(!node || typeof node !== 'object') return;
    enter(node);
    for(const k of Object.keys(node)){
      const child = node[k];
      if(Array.isArray(child)) child.forEach(c=>walk(c, enter));
      else walk(child, enter);
    }
  }

  function analyzeCode(code){
    let ast;
    try{ ast = esprima.parseScript(code, {range:true}); }
    catch(e){ return {error: e.message}; }

    const stats = {loops:0, maxLoopDepth:0, funcs:[], allocations:0, recursion:0, calls:0};

    // Track loop depth while walking
    function walkForLoops(node, depth){
      if(!node) return;
      if(['ForStatement','WhileStatement','DoWhileStatement','ForOfStatement','ForInStatement'].includes(node.type)){
        stats.loops++;
        stats.maxLoopDepth = Math.max(stats.maxLoopDepth, depth+1);
        // descend into body with deeper depth
        if(node.body) walkForLoops(node.body, depth+1);
      } else if(node.body && node.body.type){
        // generic traverse
        for(const key of Object.keys(node)){
          const child = node[key];
          if(Array.isArray(child)) child.forEach(c=>walkForLoops(c, depth)); else if(child && typeof child==='object') walkForLoops(child, depth);
        }
      }
    }

    // Collect functions and check recursion / calls
    walk(ast, node=>{
      if(['FunctionDeclaration','FunctionExpression','ArrowFunctionExpression'].includes(node.type)){
        const name = node.id && node.id.name ? node.id.name : '<anon>';
        const func = {name, recursiveCalls:0, calls:0};
        // walk function body to find calls
        walk(node.body, n=>{
          if(n.type==='CallExpression'){
            func.calls++;
            // callee identifier equal to name
            if(n.callee && n.callee.type==='Identifier' && n.callee.name===name) func.recursiveCalls++;
          }
          if(n.type==='NewExpression' && n.callee && n.callee.name==='Array') stats.allocations++;
          if(['ArrayExpression','ObjectExpression'].includes(n.type)) stats.allocations++;
        });
        stats.funcs.push(func);
        stats.recursion += func.recursiveCalls;
        stats.calls += func.calls;
      }
      if(node.type==='NewExpression' && node.callee && node.callee.name==='Array') stats.allocations++;
      if(['ArrayExpression','ObjectExpression'].includes(node.type)) stats.allocations++;
    });

    // compute nested loop depth more accurately by checking each function body
    walk(ast, node=>{
      if(node.type==='Program' || node.type==='BlockStatement' || node.type==='FunctionDeclaration' || node.type==='FunctionExpression'){
        walkForLoops(node, 0);
      }
    });

    // collect annotated nodes for UI (ranges come from Esprima)
    const nodes = [];
    walk(ast, node=>{
      if(['ForStatement','WhileStatement','DoWhileStatement','ForOfStatement','ForInStatement'].includes(node.type)){
        nodes.push({type:'loop', range: node.range});
      }
      if(node.type==='CallExpression' && node.callee && node.callee.type==='Identifier'){
        nodes.push({type:'call', name: node.callee.name, range: node.range});
      }
      if(node.type==='BinaryExpression' && node.operator==='/' && node.right && node.right.type==='Literal' && (node.right.value===2 || node.right.value===4)){
        nodes.push({type:'divide-by-2', range: node.range});
      }
      if(node.type==='MemberExpression' && node.property && node.property.name==='slice'){
        nodes.push({type:'slice', range: node.range});
      }
      if(node.type==='ReturnStatement' && node.argument && (node.argument.type==='CallExpression' || node.argument.type==='BinaryExpression')){
        nodes.push({type:'return', range: node.range});
      }
    });

    // Pattern matching for divide-and-conquer (Merge/Quick) -> O(n log n) detection
    let detectedPattern = null;
    for(const f of stats.funcs){
      // heuristics: function has two recursive calls and uses slice/divide or filter/concat
      if(f.recursiveCalls>=2){
        let hasSplit=false, hasConcat=false, hasFilter=false, hasDivide=false;
        walk(ast, node=>{
          if(node.type==='MemberExpression' && node.property && node.property.name==='slice') hasSplit=true;
          if(node.type==='CallExpression' && node.callee && node.callee.type==='MemberExpression' && node.callee.property && node.callee.property.name==='concat') hasConcat=true;
          if(node.type==='CallExpression' && node.callee && node.callee.type==='MemberExpression' && node.callee.property && node.callee.property.name==='filter') hasFilter=true;
          if(node.type==='BinaryExpression' && node.operator==='/' && node.right && node.right.type==='Literal' && (node.right.value===2 || node.right.value===4)) hasDivide=true;
        });
        if((hasSplit && hasConcat) || (f.recursiveCalls>=2 && (hasSplit || hasFilter || hasDivide))){
          detectedPattern = 'divide-and-conquer';
          break;
        }
      }
    }

    // Additional pattern detectors
    // Binary search: look for while/for loop with lo/hi and mid calculation and comparisons
    let detectedBinary = false;
    walk(ast, node=>{
      if(node.type==='WhileStatement' || node.type==='ForStatement'){
        const s = JSON.stringify(node).toLowerCase();
        if(s.includes('mid') && s.includes('hi') && s.includes('lo')) detectedBinary = true;
      }
    });
    if(detectedBinary) detectedPattern = detectedPattern || 'binary-search';

    // Counting sort: look for array uses named count and loops filling counts
    let detectedCounting = false;
    walk(ast, node=>{
      if(node.type==='VariableDeclarator' && node.id && node.id.name && node.id.name.toLowerCase().includes('count')) detectedCounting = true;
      if(node.type==='CallExpression' && node.callee && node.callee.type==='MemberExpression' && node.callee.property && node.callee.property.name==='fill') detectedCounting = detectedCounting || true;
    });
    if(detectedCounting) detectedPattern = detectedPattern || 'counting-sort';

    // Heap sort: simplistic detection by presence of 'heap' or 'sift' or parent/child index operations
    let detectedHeap = false;
    walk(ast, node=>{
      if(node.type==='Identifier' && node.name && (node.name.toLowerCase().includes('heap') || node.name.toLowerCase().includes('sift'))) detectedHeap = true;
    });
    if(detectedHeap) detectedPattern = detectedPattern || 'heap-sort';

    // heuristics for time complexity (enhanced with pattern detection)
    let time = 'O(1)';
    let confidence = 'low';
    if(detectedPattern){ time = 'O(n log n)'; confidence = 'high'; }
    else if(stats.recursion>0){
      // If recursive calls per function >1 => exponential
      const multi = stats.funcs.some(f=>f.recursiveCalls>1);
      if(multi){ time = 'O(2^n)'; confidence='medium'; }
      else {
        // single recursion: try detect divide by 2 pattern
        let divides = false;
        walk(ast, node=>{
          if(node.type==='BinaryExpression' && node.operator==='/' && ((node.right.type==='Literal' && node.right.value===2) || (node.right.type==='Literal' && node.right.value===4))){ divides=true; }
        });
        time = divides ? 'O(log n)' : 'O(n)'; confidence='medium';
      }
    } else if(stats.maxLoopDepth>0){
      if(stats.maxLoopDepth===1) { time='O(n)'; confidence='high'; }
      else if(stats.maxLoopDepth===2) { time='O(n^2)'; confidence='high'; }
      else { time=`O(n^${stats.maxLoopDepth})`; confidence='medium'; }
    } else if(stats.calls>0){
      time='O(n)'; confidence='low';
    }

    // heuristics for space
    let space = 'O(1)';
    if(stats.allocations>0) space='O(n)';
    if(stats.recursion>0) space = space==='O(n)'? 'O(n) // plus recursion stack' : 'O(n) // recursion stack';

    return {
      timeEstimate: time,
      timeConfidence: confidence,
      spaceEstimate: space,
      stats,
      nodes,
      detectedPattern,
      message: 'This is a heuristic estimation using AST analysis.'
    };
  }

  // Export
  const api = {analyzeCode};
  if(typeof module !== 'undefined' && module.exports) module.exports = api; else root.Analyzer = api;
})(typeof window !== 'undefined' ? window : global);