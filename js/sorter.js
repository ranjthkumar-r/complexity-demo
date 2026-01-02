export class SortingVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.arr = [];
        this.animating = false;
        this.queue = [];
        this.delay = 10;

        // Modal controls
        this.modal = document.getElementById('sort-modal');
        document.getElementById('close-modal').onclick = () => this.close();
    }

    open() {
        this.modal.classList.add('open');
        this.shuffle();
        this.loop();
    }

    close() {
        this.modal.classList.remove('open');
        this.animating = false;
        this.queue = [];
    }

    shuffle() {
        this.arr = Array.from({ length: 60 }, (_, i) => i + 1);
        // Fisher-Yates shuffle
        for (let i = this.arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]];
        }
        this.draw();
    }

    draw(highlight = []) {
        const { width: w, height: h } = this.canvas;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, w, h);

        const barW = w / this.arr.length;

        this.arr.forEach((val, i) => {
            const barH = (val / this.arr.length) * (h - 20);
            const x = i * barW;
            const y = h - barH;

            ctx.fillStyle = highlight.includes(i) ? '#22d3ee' : '#6366f1';
            ctx.fillRect(x + 1, y, barW - 1, barH);
        });
    }

    async start(algName) {
        if (this.animating) {
            this.animating = false;
            await new Promise(r => setTimeout(r, 100)); // Reset Wait
        }

        this.animating = true;
        this.shuffle();

        if (algName.includes('Bubble')) await this.bubbleSort();
        else if (algName.includes('Insertion')) await this.insertionSort();
        else if (algName.includes('Quick')) await this.quickSort(0, this.arr.length - 1);
        else if (algName.includes('Merge')) await this.mergeSort(0, this.arr.length - 1);

        this.animating = false;
        this.draw([]);
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Algorithms ---

    async bubbleSort() {
        const len = this.arr.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                if (!this.animating) return;

                if (this.arr[j] > this.arr[j + 1]) {
                    [this.arr[j], this.arr[j + 1]] = [this.arr[j + 1], this.arr[j]];
                }
                this.draw([j, j + 1]);
                await this.sleep(this.delay);
            }
        }
    }

    async insertionSort() {
        for (let i = 1; i < this.arr.length; i++) {
            if (!this.animating) return;
            let key = this.arr[i];
            let j = i - 1;
            while (j >= 0 && this.arr[j] > key) {
                if (!this.animating) return;
                this.arr[j + 1] = this.arr[j];
                this.draw([j, j + 1]);
                await this.sleep(this.delay);
                j--;
            }
            this.arr[j + 1] = key;
            this.draw([i]);
        }
    }

    async quickSort(low, high) {
        if (!this.animating) return;
        if (low < high) {
            let pi = await this.partition(low, high);
            await this.quickSort(low, pi - 1);
            await this.quickSort(pi + 1, high);
        }
    }

    async partition(low, high) {
        let pivot = this.arr[high];
        let i = (low - 1);
        for (let j = low; j < high; j++) {
            if (!this.animating) return;
            if (this.arr[j] < pivot) {
                i++;
                [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]];
                this.draw([i, j, high]);
                await this.sleep(this.delay);
            }
        }
        [this.arr[i + 1], this.arr[high]] = [this.arr[high], this.arr[i + 1]];
        this.draw([i + 1, high]);
        return i + 1;
    }

    async mergeSort(l, r) {
        if (!this.animating) return;
        if (l >= r) return;
        const m = l + parseInt((r - l) / 2);
        await this.mergeSort(l, m);
        await this.mergeSort(m + 1, r);
        await this.merge(l, m, r);
    }

    async merge(l, m, r) {
        const n1 = m - l + 1;
        const n2 = r - m;
        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = this.arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = this.arr[m + 1 + j];

        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (!this.animating) return;
            if (L[i] <= R[j]) { this.arr[k] = L[i]; i++; }
            else { this.arr[k] = R[j]; j++; }
            this.draw([k]);
            await this.sleep(this.delay);
            k++;
        }
        while (i < n1) {
            if (!this.animating) return;
            this.arr[k] = L[i]; i++; k++;
            this.draw([k]); await this.sleep(this.delay);
        }
        while (j < n2) {
            if (!this.animating) return;
            this.arr[k] = R[j]; j++; k++;
            this.draw([k]); await this.sleep(this.delay);
        }
    }

    // Placeholder to allow calling loop from outside if needed, 
    // though this class handles its own loop via async/await
    loop() { }
}
