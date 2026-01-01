// Complexity Explorer - interactive visualizer with toggles + more sorts
let algorithms = [];
const canvas = document.getElementById('complexity-canvas');
const ctx = canvas.getContext('2d');
const legendEl = document.getElementById('legend');
const algSelect = document.getElementById('alg-select');
const algList = document.getElementById('alg-list');
const search = document.getElementById('search');
const highlightBtn = document.getElementById('highlight-btn');
const toggleCurvesBtn = document.getElementById('toggle-curves');
const algName = document.getElementById('alg-name');
const algDesc = document.getElementById('alg-desc');
const algCategory = document.getElementById('alg-category');
const algTime = document.getElementById('alg-time');
const algSpace = document.getElementById('alg-space');
const algCode = document.getElementById('alg-code').querySelector('code');
const showSortVisBtn = document.getElementById('show-sort-vis');
const sortModal = document.getElementById('sort-visualizer');
const sortCanvas = document.getElementById('sort-canvas');
const sortCtx = sortCanvas.getContext('2d');
let highlighted = null;

const colorMap = {
  '1':'#0B5FFF','logn':'#F97316','n':'#059669','nlogn':'#8B5CF6','n2':'#EF4444','n3':'#F43F5E','2powern':'#0F1724'
};
const functions = {
  '1': n => 1,
  'logn': n => Math.log2(n+1),
  'n': n => n,
  'nlogn': n => n*Math.log2(n+1),
  'n2': n => n*n,
  'n3': n => n*n*n,
  '2powern': n => Math.pow(2,n)
};
// Which curves are visible
let visibleCurves = new Set(Object.keys(functions));

function fetchData(){
  fetch('data/algorithms.json').then(r=>r.json()).then(data=>{
    algorithms = data;
    populateList();
    if(algorithms.length) selectAlgorithm(algorithms[0].id);
    createSortOptions();
    drawBasePlot();
  });
}

function populateList(){
  algSelect.innerHTML=''; algList.innerHTML='';
  algorithms.forEach(a=>{
    const opt=document.createElement('option'); opt.value=a.id; opt.textContent=a.name; opt.title = a.desc || '' ; algSelect.appendChild(opt);
    const item=document.createElement('div'); item.className='alg-item'; item.textContent=a.name+ ' — ' + a.category; item.title = a.desc || ''; item.onclick=()=>selectAlgorithm(a.id); algList.appendChild(item);
  });
}

function selectAlgorithm(id){
  const a = algorithms.find(x=>x.id===id);
  if(!a) return;
  algSelect.value = a.id;
  algName.textContent = a.name;
  algDesc.textContent = a.desc;
  algCategory.textContent = a.category;
  algTime.textContent = (a.time.best||'-') + ' / ' + (a.time.avg||'-') + ' / ' + (a.time.worst||'-');
  algSpace.textContent = a.space;
  algCode.textContent = a.code;
  if(a.category==='Sorting') showSortVisBtn.classList.remove('hidden'); else showSortVisBtn.classList.add('hidden');
}

algSelect.onchange = ()=> selectAlgorithm(algSelect.value);
search.oninput = ()=>{
  const q = search.value.toLowerCase(); algList.innerHTML='';
  algorithms.filter(a=>a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)).forEach(a=>{
    const item=document.createElement('div'); item.className='alg-item'; item.textContent=a.name+ ' — ' + a.category; item.onclick=()=>selectAlgorithm(a.id); algList.appendChild(item);
  });
}

highlightBtn.onclick = ()=>{
  const id = algSelect.value; if(!id) return; const a = algorithms.find(x=>x.id===id); highlighted = a ? a.complexityFunction : null; drawBasePlot();
}

toggleCurvesBtn.onclick = ()=>{
  // Toggle all: if any hidden, show all; else hide all
  const anyHidden = Object.keys(functions).some(k=>!visibleCurves.has(k));
  if(anyHidden) visibleCurves = new Set(Object.keys(functions)); else visibleCurves = new Set();
  drawBasePlot();
}

// draw predefined complexity curves
function drawBasePlot(){
  const w = canvas.width, h = canvas.height; ctx.clearRect(0,0,w,h);
  // background grid
  ctx.strokeStyle='#eee'; ctx.lineWidth=1; for(let i=0;i<10;i++){ ctx.beginPath(); ctx.moveTo(0,i*h/9); ctx.lineTo(w,i*h/9); ctx.stroke(); }
  // sample n values
  const N = 20; const xs = Array.from({length:N},(_,i)=>i+1);
  // compute raw values for each named function and prepare scaled copy for drawing
  const curves = {};
  const rawCurves = {};
  let globalMax = 0, globalMin = Infinity;
  Object.keys(functions).forEach(key=>{ const vals = xs.map(n=>functions[key](n)); rawCurves[key] = vals; curves[key] = vals.slice(); const max = Math.max(...vals); const min = Math.min(...vals); if(max>globalMax) globalMax=max; if(min<globalMin) globalMin=min; });
  // If range is too large (e.g., 2^n), compress using log1p for drawing only
  const useLog = globalMax / (globalMin+1) > 1e4;
  if(useLog){ Object.keys(curves).forEach(k=>{ curves[k] = curves[k].map(v=>Math.log1p(v)); }); globalMax = Math.max(...Object.values(curves).flat()); }

  // normalize and draw
  let i=0;
  legendEl.innerHTML='';
  Object.keys(curves).forEach(key=>{
    const vals = curves[key];
    const color = colorMap[key] || `hsl(${i*60},60%,50%)`;
    const isVisible = visibleCurves.has(key);
    const width = (highlighted && highlighted!==key)?1.0:2.5;

    // draw curve
    if(isVisible){ ctx.beginPath(); ctx.lineWidth=width; ctx.strokeStyle=color; vals.forEach((v,idx)=>{ const x = idx/(xs.length-1)*(w-40)+30; const y = h - (v/globalMax)*(h-40)-20; if(idx===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); }

    // legend
    const li = document.createElement('div'); li.className='item'; if(!isVisible) li.classList.add('hidden'); li.dataset.curve = key;
    const dot = document.createElement('span'); dot.className='dot'; dot.style.background=color; li.appendChild(dot); const t = document.createElement('span'); t.textContent = key + (useLog ? ' (log scale)' : ''); li.appendChild(t); li.title = `Toggle ${key} (click) - color example`;
    li.setAttribute('role','button'); li.setAttribute('aria-pressed', isVisible ? 'true' : 'false');
    legendEl.appendChild(li);
    li.onclick = ()=>{ if(visibleCurves.has(key)) { visibleCurves.delete(key); li.setAttribute('aria-pressed','false'); } else { visibleCurves.add(key); li.setAttribute('aria-pressed','true'); } drawBasePlot(); };
    li.onmouseover = ()=>{ li.classList.add('hover'); highlighted = key; drawBasePlot(); };
    li.onmouseout = ()=>{ li.classList.remove('hover'); highlighted = null; drawBasePlot(); };
    i++;
  });
  if(highlighted){ // draw highlight label
    ctx.fillStyle='#111'; ctx.font='14px sans-serif'; ctx.fillText('Highlighted: '+highlighted, 10, 16);
  }

  // store draw data for tooltip usage
  window.__lastPlot = { xs, rawCurves: rawCurves, scaledCurves: curves, globalMax, useLog };
}

// add tooltip handlers for canvas hover
canvas.addEventListener('mousemove', (ev)=>{
  const rect = canvas.getBoundingClientRect(); const x = ev.clientX - rect.left; const y = ev.clientY - rect.top;
  if(!window.__lastPlot) return; const { xs, rawCurves, scaledCurves, globalMax } = window.__lastPlot;
  // closest index
  const w = canvas.width; const idx = Math.round(( (x-30) / (w-40) ) * (xs.length-1)); if(idx<0 || idx>=xs.length) { document.getElementById('plot-tooltip').classList.add('hidden'); return; }
  const items = [];
  Object.keys(rawCurves).forEach(k=>{ if(!visibleCurves.has(k)) return; const val = rawCurves[k][idx]; items.push({k,val,color: colorMap[k]||'#333'}); });
  if(!items.length){ document.getElementById('plot-tooltip').classList.add('hidden'); return; }
  const tip = document.getElementById('plot-tooltip'); tip.innerHTML = `<div><strong>n = ${xs[idx]}</strong></div>` + items.map(it=>`<div class="row"><span class="dot" style="background:${it.color}"></span><span>${it.k}: ${formatNumber(it.val)}</span></div>`).join(''); tip.style.left = (ev.clientX + 12) + 'px'; tip.style.top = (ev.clientY + 12) + 'px'; tip.classList.remove('hidden');
});
canvas.addEventListener('mouseout', ()=>{ document.getElementById('plot-tooltip').classList.add('hidden'); });

function formatNumber(v){ if(v>1e6) return v.toExponential(2); if(v>1000) return Math.round(v); return Number.isInteger(v)?v: v.toFixed(2); }

// Sorting visualizer (Bubble, Insertion, Merge, Quick)
let arr = []; let animating=false;
function createSortOptions(){ const sel = document.getElementById('sort-alg'); sel.innerHTML=''; ['Bubble Sort','Insertion Sort','Merge Sort','Quick Sort'].forEach(n=>{ const o=document.createElement('option'); o.textContent=n; sel.appendChild(o); }); }
function shuffleArray(n=40){ arr = Array.from({length:n}, (_,i)=>i+1).sort(()=>Math.random()-0.5); drawArray(); }
function drawArray(highlightIndices=[]){ const w=sortCanvas.width, h = sortCanvas.height; sortCtx.clearRect(0,0,w,h); const barW = w/arr.length; for(let i=0;i<arr.length;i++){ const val = arr[i]; const x = i*barW; const bw = barW*0.9; const barH = val / arr.length * (h-20); sortCtx.fillStyle = highlightIndices.includes(i) ? '#F97316' : '#0B5FFF'; sortCtx.fillRect(x+barW*0.05, h-barH, bw, barH); } }
function bubbleSortAnim(){ if(animating) return; animating=true; let i=0,j=0; const step = ()=>{ if(i>=arr.length){ animating=false; return; } if(j< arr.length-1-i){ if(arr[j]>arr[j+1]){ [arr[j],arr[j+1]]=[arr[j+1],arr[j]]; } drawArray([j,j+1]); j++; setTimeout(step,20); } else { j=0; i++; setTimeout(step,10); } } ; step(); }
function insertionSortAnim(){ if(animating) return; animating=true; let i=1; const step = ()=>{ if(i>=arr.length){ animating=false; return; } let j=i-1; const key=arr[i]; const inner = ()=>{ if(j>=0 && arr[j]>key){ arr[j+1]=arr[j]; drawArray([j,j+1]); j--; setTimeout(inner,20); } else { arr[j+1]=key; i++; setTimeout(step,10); } } ; inner(); } ; step(); }

// QuickSort: iterative partition-based animation
function quickSortAnim(){ if(animating) return; animating=true; const stack=[[0,arr.length-1]];
  const step = ()=>{
    if(stack.length===0){ animating=false; return; }
    const [lo,hi] = stack.pop(); if(lo>=hi){ setTimeout(step,0); return; }
    const pivot = arr[hi]; let i=lo;
    let j=lo;
    const partStep = ()=>{
      if(j<hi){ if(arr[j]<pivot){ [arr[i],arr[j]]=[arr[j],arr[i]]; i++; } drawArray([i,j,hi]); j++; setTimeout(partStep,30); }
      else { [arr[i],arr[hi]]=[arr[hi],arr[i]]; drawArray([i]); // push subranges
        stack.push([lo,i-1]); stack.push([i+1,hi]); setTimeout(step,30);
      }
    };
    partStep();
  };
  step();
}

// MergeSort: bottom-up merges with animation
function mergeSortAnim(){ if(animating) return; animating=true; const n = arr.length; let width = 1;
  const aux = new Array(n);
  const doMerge = (l, r, mid, cb)=>{
    let i=l, j=mid, k=l;
    const inner = ()=>{
      if(i<mid && j<r){ if(arr[i]<=arr[j]) aux[k++]=arr[i++]; else aux[k++]=arr[j++]; drawArray([i,j]); setTimeout(inner,10); }
      else if(i<mid){ aux[k++]=arr[i++]; setTimeout(inner,10); }
      else if(j<r){ aux[k++]=arr[j++]; setTimeout(inner,10); }
      else { for(let t=l;t<r;t++) arr[t]=aux[t]; drawArray([]); setTimeout(cb,10); }
    };
    inner();
  };
  const step = ()=>{
    if(width>=n){ animating=false; return; }
    let l=0;
    const loop = ()=>{ if(l<n){ const mid = Math.min(l+width, n); const r = Math.min(l+2*width,n); if(mid<r){ doMerge(l,r,mid, ()=>{ l+=2*width; loop(); }); } else { l+=2*width; setTimeout(loop,0); } } else { width*=2; setTimeout(step,30); } };
    loop();
  };
  step();
}

document.getElementById('shuffle').onclick = ()=>shuffleArray(80);
document.getElementById('start-sort').onclick = ()=>{ const alg = document.getElementById('sort-alg').value; if(alg.includes('Bubble')) bubbleSortAnim(); else if(alg.includes('Insertion')) insertionSortAnim(); else if(alg.includes('Merge')) mergeSortAnim(); else quickSortAnim(); };
document.getElementById('close-viz').onclick = ()=>{ sortModal.classList.add('hidden'); };
showSortVisBtn.onclick = ()=>{ sortModal.classList.remove('hidden'); resizeCanvases(); shuffleArray(80); };

// handle responsive canvas sizes
function resizeCanvases(){
  // complexity canvas: fit to container
  const visual = document.querySelector('.visual');
  canvas.width = Math.max(600, Math.floor((visual.clientWidth || 800)) );
  canvas.height = 320;
  // sort canvas
  const wrap = document.getElementById('sort-canvas-wrap');
  if(wrap){ sortCanvas.width = Math.max(400, Math.floor(wrap.clientWidth)); sortCanvas.height = 220; }
  drawBasePlot(); if(arr.length) drawArray();
}
window.addEventListener('resize', ()=>{ resizeCanvases(); });
// initial
fetchData(); resizeCanvases(); drawBasePlot();