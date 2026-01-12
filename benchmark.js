// Benchmark functionality

class Benchmark {
    constructor() {
        this.results = {};
    }

    async runBenchmark(size) {
        const algorithms = ['bubble', 'insertion', 'merge', 'quick'];
        const results = {};
        
        for (let algo of algorithms) {
            const arr = this.generateRandomArray(size);
            const arrCopy = [...arr];
            
            const startTime = performance.now();
            
            switch(algo) {
                case 'bubble':
                    await sortingAlgorithms.bubbleSort(arrCopy);
                    break;
                case 'insertion':
                    await sortingAlgorithms.insertionSort(arrCopy);
                    break;
                case 'merge':
                    await sortingAlgorithms.mergeSort(arrCopy);
                    break;
                case 'quick':
                    await sortingAlgorithms.quickSort(arrCopy);
                    break;
            }
            
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            
            results[algo] = {
                time: timeTaken,
                comparisons: sortingAlgorithms.comparisons,
                swaps: sortingAlgorithms.swaps
            };
        }
        
        return results;
    }

    generateRandomArray(size) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Math.floor(Math.random() * 10000));
        }
        return arr;
    }

    displayResults(results, size) {
        const container = document.getElementById('benchmark-results');
        container.innerHTML = '';
        
        const algorithms = {
            'bubble': {
                name: 'Bubble Sort',
                complexity: 'O(n²)'
            },
            'insertion': {
                name: 'Insertion Sort',
                complexity: 'O(n²)'
            },
            'merge': {
                name: 'Merge Sort',
                complexity: 'O(n log n)'
            },
            'quick': {
                name: 'Quick Sort',
                complexity: 'O(n log n) avg'
            }
        };
        
        for (let algo in results) {
            const card = document.createElement('div');
            card.className = 'benchmark-card';
            
            const result = results[algo];
            const info = algorithms[algo];
            
            card.innerHTML = `
                <h3>${info.name}</h3>
                <div class="time">${result.time.toFixed(2)} ms</div>
                <div class="complexity">Time Complexity: ${info.complexity}</div>
                <div style="margin-top: 10px; font-size: 0.9em;">
                    <div>Comparisons: ${result.comparisons.toLocaleString()}</div>
                    <div>Swaps: ${result.swaps.toLocaleString()}</div>
                    <div>Array Size: ${size.toLocaleString()}</div>
                </div>
            `;
            
            container.appendChild(card);
        }
    }
}

const benchmark = new Benchmark();
