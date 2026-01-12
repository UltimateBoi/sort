// Main application logic

const visualizer = new Visualizer('canvas');

const algorithmInfo = {
    bubble: {
        title: 'Bubble Sort',
        timeComplexity: 'O(n²) average and worst case, O(n) best case',
        spaceComplexity: 'O(1)',
        description: 'Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
        example: '[5, 2, 8, 1, 9] → [2, 5, 1, 8, 9] → [2, 1, 5, 8, 9] → [1, 2, 5, 8, 9]',
        code: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`
    },
    insertion: {
        title: 'Insertion Sort',
        timeComplexity: 'O(n²) average and worst case, O(n) best case',
        spaceComplexity: 'O(1)',
        description: 'Insertion sort builds the final sorted array one item at a time. It iterates through an input array and removes one element per iteration, finds the place the element belongs in the sorted list, and inserts it there.',
        example: '[5, 2, 8, 1, 9] → [2, 5, 8, 1, 9] → [2, 5, 8, 1, 9] → [1, 2, 5, 8, 9]',
        code: `function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`
    },
    merge: {
        title: 'Merge Sort',
        timeComplexity: 'O(n log n) for all cases',
        spaceComplexity: 'O(n)',
        description: 'Merge sort is a divide-and-conquer algorithm. It divides the input array into two halves, recursively sorts them, and then merges the two sorted halves. The merge operation is the key process that assumes the two halves are sorted and merges them into a single sorted sequence.',
        example: '[5, 2, 8, 1] → [5, 2] [8, 1] → [2, 5] [1, 8] → [1, 2, 5, 8]',
        code: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}`
    },
    quick: {
        title: 'Quick Sort',
        timeComplexity: 'O(n log n) average case, O(n²) worst case',
        spaceComplexity: 'O(log n)',
        description: 'Quick sort is a divide-and-conquer algorithm. It picks an element as a pivot and partitions the array around the pivot. The key process is partitioning: the goal is to place the pivot at its correct position in the sorted array and put all smaller elements to the left and all greater elements to the right.',
        example: '[5, 2, 8, 1, 9] (pivot=9) → [5, 2, 8, 1] 9 [] → [1, 2, 5, 8, 9]',
        code: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Generate initial array
    visualizer.generateArray(50);

    // Algorithm selection
    const algorithmSelect = document.getElementById('algorithm-select');
    algorithmSelect.addEventListener('change', (e) => {
        updateAlgorithmInfo(e.target.value);
        updateCodeExample(e.target.value);
    });

    // Array size slider
    const arraySizeSlider = document.getElementById('array-size');
    const sizeValue = document.getElementById('size-value');
    arraySizeSlider.addEventListener('input', (e) => {
        sizeValue.textContent = e.target.value;
    });

    // Speed slider
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speed-value');
    speedSlider.addEventListener('input', (e) => {
        speedValue.textContent = e.target.value;
        visualizer.speed = parseInt(e.target.value);
    });

    // Generate new array button
    document.getElementById('generate-btn').addEventListener('click', () => {
        const size = parseInt(arraySizeSlider.value);
        visualizer.generateArray(size);
        resetStats();
    });

    // Sort button
    document.getElementById('sort-btn').addEventListener('click', async () => {
        const algorithm = algorithmSelect.value;
        await visualizer.sort(algorithm);
    });

    // Stop button
    document.getElementById('stop-btn').addEventListener('click', () => {
        visualizer.stop();
    });

    // Benchmark button
    document.getElementById('run-benchmark-btn').addEventListener('click', async () => {
        const btn = document.getElementById('run-benchmark-btn');
        const size = parseInt(document.getElementById('benchmark-size').value);
        
        btn.disabled = true;
        btn.textContent = 'Running...';
        
        const results = await benchmark.runBenchmark(size);
        benchmark.displayResults(results, size);
        
        btn.disabled = false;
        btn.textContent = 'Run Benchmark';
    });

    // Code example tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateCodeExample(e.target.dataset.tab);
        });
    });
});

function updateAlgorithmInfo(algorithm) {
    const info = algorithmInfo[algorithm];
    const infoContent = document.getElementById('info-content');
    const algorithmTitle = document.getElementById('algorithm-title');
    
    algorithmTitle.textContent = info.title;
    
    infoContent.innerHTML = `
        <h3>${info.title}</h3>
        <p><strong>Time Complexity:</strong> ${info.timeComplexity}</p>
        <p><strong>Space Complexity:</strong> ${info.spaceComplexity}</p>
        <p><strong>Description:</strong> ${info.description}</p>
        <p><strong>Example:</strong> ${info.example}</p>
    `;
}

function updateCodeExample(algorithm) {
    const info = algorithmInfo[algorithm];
    const codeExample = document.getElementById('code-example');
    codeExample.innerHTML = `<code>${escapeHtml(info.code)}</code>`;
}

function resetStats() {
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('time').textContent = '0';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
