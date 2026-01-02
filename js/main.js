import { algorithms } from './algorithms.js';
import { ComplexityChart } from './complexity-chart.js';
import { SortingVisualizer } from './sorter.js';

class App {
    constructor() {
        this.chart = new ComplexityChart('complexity-canvas');
        this.sorter = new SortingVisualizer('sort-canvas');
        this.chart.renderLegend('legend');

        this.state = {
            activeId: algorithms[0].id
        };

        this.initUI();
        this.selectAlgorithm(this.state.activeId);
    }

    initUI() {
        // Render Sidebar List
        const listEl = document.getElementById('alg-list');
        listEl.innerHTML = '';

        algorithms.forEach(alg => {
            const el = document.createElement('div');
            el.className = 'alg-item';
            el.dataset.id = alg.id;
            el.innerHTML = `<h4>${alg.name}</h4><span>${alg.category}</span>`;
            el.onclick = () => this.selectAlgorithm(alg.id);
            listEl.appendChild(el);
        });

        // Search
        document.getElementById('search').oninput = (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.alg-item').forEach(item => {
                const text = item.innerText.toLowerCase();
                item.style.display = text.includes(q) ? 'block' : 'none';
            });
        };

        // Actions
        document.getElementById('highlight-btn').onclick = () => {
            const alg = algorithms.find(a => a.id === this.state.activeId);
            if (alg) this.chart.setHighlight(alg.complexityFunction);
        };

        document.getElementById('show-sort-btn').onclick = () => this.sorter.open();

        // Sorter Controls
        document.getElementById('start-sort').onclick = () => {
            const alg = algorithms.find(a => a.id === this.state.activeId);
            this.sorter.start(alg ? alg.name : 'Bubble Sort');
        };
        document.getElementById('shuffle-btn').onclick = () => this.sorter.shuffle();
    }

    selectAlgorithm(id) {
        this.state.activeId = id;
        const alg = algorithms.find(a => a.id === id);
        if (!alg) return;

        // Update Active Class
        document.querySelectorAll('.alg-item').forEach(el =>
            el.classList.toggle('active', el.dataset.id === id));

        // Content
        document.getElementById('alg-title').textContent = alg.name;
        document.getElementById('alg-desc').textContent = alg.desc;
        document.getElementById('val-time').textContent = alg.time.avg;
        document.getElementById('val-space').textContent = alg.space;
        document.getElementById('code-block').textContent = alg.code;

        // Color code values
        const t = alg.time.avg;
        const timeEl = document.getElementById('val-time');
        timeEl.className = 'value';
        if (t.includes('1') || t.includes('log')) timeEl.classList.add('complexity-good');
        else if (t.includes('^2') || t.includes('2^')) timeEl.classList.add('complexity-bad');

        // Show/Hide Sort Button
        const sortBtn = document.getElementById('show-sort-btn');
        if (alg.category === 'Sorting') sortBtn.style.display = 'inline-flex';
        else sortBtn.style.display = 'none';

        // Auto highlight chart ?? No, let user click it
        this.chart.setHighlight(null);
    }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
