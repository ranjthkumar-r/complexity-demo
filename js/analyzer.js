// Adapted from legacy analyzer to ES module
// Relies on window.esprima from CDN

function walk(node, enter) {
    if (!node || typeof node !== 'object') return;
    enter(node);
    for (const k of Object.keys(node)) {
        const child = node[k];
        if (Array.isArray(child)) child.forEach(c => walk(c, enter));
        else walk(child, enter);
    }
}

export function analyzeCode(code) {
    if (!window.esprima) return { error: "Esprima library not loaded." };

    let ast;
    try {
        ast = window.esprima.parseScript(code, { range: true });
    } catch (e) {
        return { error: e.message };
    }

    const stats = { loops: 0, maxLoopDepth: 0, funcs: [], allocations: 0, recursion: 0, calls: 0 };

    function walkForLoops(node, depth) {
        if (!node) return;
        if (['ForStatement', 'WhileStatement', 'DoWhileStatement', 'ForOfStatement', 'ForInStatement'].includes(node.type)) {
            stats.loops++;
            stats.maxLoopDepth = Math.max(stats.maxLoopDepth, depth + 1);
            if (node.body) walkForLoops(node.body, depth + 1);
        } else if (node.body && node.body.type) {
            // traverse block
            for (const key of Object.keys(node)) {
                const child = node[key];
                if (Array.isArray(child)) child.forEach(c => walkForLoops(c, depth));
                else if (child && typeof child === 'object') walkForLoops(child, depth);
            }
        }
    }

    // Collect functions and check recursion / calls
    walk(ast, node => {
        if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type)) {
            const name = node.id && node.id.name ? node.id.name : '<anon>';
            const func = { name, recursiveCalls: 0, calls: 0 };

            walk(node.body, n => {
                if (n.type === 'CallExpression') {
                    func.calls++;
                    if (n.callee && n.callee.type === 'Identifier' && n.callee.name === name) func.recursiveCalls++;
                }
                if (n.type === 'NewExpression' && n.callee && n.callee.name === 'Array') stats.allocations++;
                if (['ArrayExpression', 'ObjectExpression'].includes(n.type)) stats.allocations++;
            });

            stats.funcs.push(func);
            stats.recursion += func.recursiveCalls;
            stats.calls += func.calls;
        }
        if (node.type === 'NewExpression' && node.callee && node.callee.name === 'Array') stats.allocations++;
        if (['ArrayExpression', 'ObjectExpression'].includes(node.type)) stats.allocations++;
    });

    // Compute loop depth
    walk(ast, node => {
        if (['Program', 'BlockStatement', 'FunctionDeclaration', 'FunctionExpression'].includes(node.type)) {
            walkForLoops(node, 0);
        }
    });

    // --- Heuristics ---
    let time = 'O(1)';
    let confidence = 'low';

    // Recursion checks
    if (stats.recursion > 0) {
        const multi = stats.funcs.some(f => f.recursiveCalls > 1);
        if (multi) { time = 'O(2^n)'; confidence = 'medium'; }
        else {
            // Check for divide pattern (helpers)
            let divides = false;
            walk(ast, n => {
                if (n.type === 'BinaryExpression' && n.operator === '/' && n.right.type === 'Literal' && n.right.value === 2) divides = true;
            });
            time = divides ? 'O(log n)' : 'O(n)';
            confidence = 'medium';
        }
    } else if (stats.maxLoopDepth > 0) {
        if (stats.maxLoopDepth === 1) { time = 'O(n)'; confidence = 'high'; }
        else if (stats.maxLoopDepth === 2) { time = 'O(n^2)'; confidence = 'high'; }
        else { time = `O(n^${stats.maxLoopDepth})`; confidence = 'medium'; }
    } else if (stats.calls > 0) {
        time = 'O(n)'; confidence = 'low';
    }

    let space = 'O(1)';
    if (stats.allocations > 0) space = 'O(n)';
    if (stats.recursion > 0) space = space === 'O(n)' ? 'O(n) + Stack' : 'O(n) Stack';

    return {
        timeEstimate: time,
        timeConfidence: confidence,
        spaceEstimate: space,
        stats
    };
}
