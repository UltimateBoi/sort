// Visualizer class for drawing the sorting process

class Visualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.array = [];
        this.colors = [];
        this.isRunning = false;
        this.speed = 50;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 4;
        this.canvas.height = 400;
        this.draw();
    }

    generateArray(size) {
        this.array = [];
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * (this.canvas.height - 50)) + 10);
        }
        this.colors = new Array(size).fill('#667eea');
        this.draw();
    }

    draw(pointers = []) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const barWidth = this.canvas.width / this.array.length;
        const maxHeight = this.canvas.height - 60; // Extra space for pointer labels
        const maxValue = Math.max(...this.array);
        
        for (let i = 0; i < this.array.length; i++) {
            this.ctx.fillStyle = this.colors[i];
            const barHeight = (this.array[i] / maxValue) * maxHeight;
            this.ctx.fillRect(
                i * barWidth,
                this.canvas.height - barHeight - 40,
                barWidth - 1,
                barHeight
            );
        }

        // Draw pointers
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        for (let pointer of pointers) {
            const x = pointer.index * barWidth + barWidth / 2;
            const y = this.canvas.height - 5;
            
            // Draw pointer arrow
            this.ctx.fillStyle = pointer.color || '#ff6b6b';
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - 20);
            this.ctx.lineTo(x - 5, y - 10);
            this.ctx.lineTo(x + 5, y - 10);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Draw pointer label
            this.ctx.fillStyle = pointer.color || '#ff6b6b';
            this.ctx.fillText(pointer.label, x, y);
        }
    }

    async animateStep(step) {
        if (!this.isRunning) return;

        // Apply the array changes from the step
        if (step.arrayState) {
            this.array = [...step.arrayState];
        }

        if (step.type === 'compare') {
            for (let idx of step.indices) {
                this.colors[idx] = '#f56565';
            }
        } else if (step.type === 'swap') {
            for (let idx of step.indices) {
                this.colors[idx] = '#48bb78';
            }
        }

        // Handle pointer visualization
        let pointers = step.pointers || [];
        this.draw(pointers);
        await this.sleep(this.speed);

        for (let idx of step.indices) {
            this.colors[idx] = '#667eea';
        }
        this.draw(pointers);
    }

    async highlightSorted() {
        for (let i = 0; i < this.array.length; i++) {
            if (!this.isRunning) break;
            this.colors[i] = '#48bb78';
            this.draw();
            await this.sleep(10);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        this.isRunning = false;
        this.colors = new Array(this.array.length).fill('#667eea');
        this.draw();
    }

    async sort(algorithm) {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const startTime = performance.now();
        
        const arr = [...this.array];
        let steps = [];
        
        switch(algorithm) {
            case 'bubble':
                await sortingAlgorithms.bubbleSort(arr, true);
                break;
            case 'insertion':
                await sortingAlgorithms.insertionSort(arr, true);
                break;
            case 'merge':
                await sortingAlgorithms.mergeSort(arr, true);
                break;
            case 'quick':
                await sortingAlgorithms.quickSort(arr, true);
                break;
        }
        
        steps = sortingAlgorithms.steps;
        
        for (let step of steps) {
            if (!this.isRunning) break;
            await this.animateStep(step);
        }
        
        if (this.isRunning) {
            // Update to final sorted array
            this.array = arr;
            await this.highlightSorted();
            const endTime = performance.now();
            document.getElementById('time').textContent = Math.round(endTime - startTime);
        }
        
        document.getElementById('comparisons').textContent = sortingAlgorithms.comparisons;
        document.getElementById('swaps').textContent = sortingAlgorithms.swaps;
        
        this.isRunning = false;
    }
}
