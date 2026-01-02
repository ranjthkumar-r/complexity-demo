// Empirical profiler worker: receives {code, fnName, sizes, runsPerSize}
self.onmessage = async (ev)=>{
  const {code, fnName, sizes = [100,200,400,800,1600], runsPerSize = 3, timeout=2000} = ev.data;
  const result = {timings:[], error:null};
  try{
    // sandbox: evaluate code in worker scope
    let exportedFn = null;
    try{ eval(code); } catch(e){ throw new Error('Code eval error: '+e.message); }
    if(fnName && typeof self[fnName] === 'function'){ exportedFn = self[fnName]; }
    else {
      // try to find first global function
      for(const k in self){ if(typeof self[k] === 'function' && k!=='onmessage'){ exportedFn = self[k]; fnName = k; break; } }
    }
    if(!exportedFn) throw new Error('Function "'+fnName+'" not found in evaluated code.');

    for(const n of sizes){
      // generate input array of size n
      const input = Array.from({length:n},(_,i)=>Math.floor(Math.random()*n));
      // run runsPerSize times and average
      let total = 0; let runs = 0;
      for(let r=0;r<runsPerSize;r++){
        const p = new Promise((resolve, reject)=>{
          const start = performance.now();
          try{
            // time-limited execution using setTimeout to detect long runs
            const res = exportedFn(input.slice());
            const end = performance.now();
            resolve(end-start);
          }catch(err){ reject(err); }
        });
        const val = await Promise.race([p, new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')), timeout))]);
        total += val; runs++;
      }
      result.timings.push({n, avg: total / runs});
    }
    result.fnName = fnName;
  }catch(e){ result.error = e.message; }
  self.postMessage(result);
};