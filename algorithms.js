// Sorting Algorithms Implementation

class SortingAlgorithms {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.steps = [];
    }

    reset() {
        this.comparisons = 0;
        this.swaps = 0;
        this.steps = [];
    }

    // Bubble Sort
    async bubbleSort(arr, visualize = false) {
        this.reset();
        const n = arr.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                if (visualize) {
                    this.steps.push({
                        type: 'compare',
                        indices: [j, j + 1],
                        arrayState: [...arr],
                        pointers: [
                            { index: j, label: 'j', color: '#f59e0b' },
                            { index: j + 1, label: 'j+1', color: '#8b5cf6' }
                        ]
                    });
                }
                
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.swaps++;
                    if (visualize) {
                        this.steps.push({
                            type: 'swap',
                            indices: [j, j + 1],
                            arrayState: [...arr],
                            pointers: [
                                { index: j, label: 'j', color: '#f59e0b' },
                                { index: j + 1, label: 'j+1', color: '#8b5cf6' }
                            ]
                        });
                    }
                }
            }
        }
        return arr;
    }

    // Insertion Sort
    async insertionSort(arr, visualize = false) {
        this.reset();
        const n = arr.length;
        
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            
            while (j >= 0) {
                this.comparisons++;
                if (visualize) {
                    this.steps.push({
                        type: 'compare',
                        indices: [j, j + 1],
                        arrayState: [...arr],
                        pointers: [
                            { index: i, label: 'key', color: '#10b981' },
                            { index: j, label: 'j', color: '#f59e0b' }
                        ]
                    });
                }
                
                if (arr[j] > key) {
                    arr[j + 1] = arr[j];
                    this.swaps++;
                    if (visualize) {
                        this.steps.push({
                            type: 'swap',
                            indices: [j, j + 1],
                            arrayState: [...arr],
                            pointers: [
                                { index: i, label: 'key', color: '#10b981' },
                                { index: j, label: 'j', color: '#f59e0b' }
                            ]
                        });
                    }
                    j--;
                } else {
                    break;
                }
            }
            arr[j + 1] = key;
        }
        return arr;
    }

    // Merge Sort
    async mergeSort(arr, visualize = false, start = 0, end = null) {
        if (end === null) {
            this.reset();
            end = arr.length - 1;
        }
        
        if (start < end) {
            const mid = Math.floor((start + end) / 2);
            await this.mergeSort(arr, visualize, start, mid);
            await this.mergeSort(arr, visualize, mid + 1, end);
            await this.merge(arr, visualize, start, mid, end);
        }
        return arr;
    }

    async merge(arr, visualize, start, mid, end) {
        const left = arr.slice(start, mid + 1);
        const right = arr.slice(mid + 1, end + 1);
        
        let i = 0, j = 0, k = start;
        
        while (i < left.length && j < right.length) {
            this.comparisons++;
            if (visualize) {
                this.steps.push({
                    type: 'compare',
                    indices: [start + i, mid + 1 + j],
                    arrayState: [...arr],
                    pointers: [
                        { index: start, label: 'start', color: '#3b82f6' },
                        { index: mid, label: 'mid', color: '#f59e0b' },
                        { index: end, label: 'end', color: '#ef4444' },
                        { index: k, label: 'k', color: '#10b981' }
                    ]
                });
            }
            
            if (left[i] <= right[j]) {
                arr[k] = left[i];
                i++;
            } else {
                arr[k] = right[j];
                j++;
            }
            this.swaps++;
            if (visualize) {
                this.steps.push({
                    type: 'swap',
                    indices: [k],
                    arrayState: [...arr],
                    pointers: [
                        { index: start, label: 'start', color: '#3b82f6' },
                        { index: mid, label: 'mid', color: '#f59e0b' },
                        { index: end, label: 'end', color: '#ef4444' },
                        { index: k, label: 'k', color: '#10b981' }
                    ]
                });
            }
            k++;
        }
        
        while (i < left.length) {
            arr[k] = left[i];
            i++;
            k++;
            this.swaps++;
            if (visualize) {
                this.steps.push({
                    type: 'swap',
                    indices: [k - 1],
                    arrayState: [...arr],
                    pointers: [
                        { index: start, label: 'start', color: '#3b82f6' },
                        { index: mid, label: 'mid', color: '#f59e0b' },
                        { index: end, label: 'end', color: '#ef4444' }
                    ]
                });
            }
        }
        
        while (j < right.length) {
            arr[k] = right[j];
            j++;
            k++;
            this.swaps++;
            if (visualize) {
                this.steps.push({
                    type: 'swap',
                    indices: [k - 1],
                    arrayState: [...arr],
                    pointers: [
                        { index: start, label: 'start', color: '#3b82f6' },
                        { index: mid, label: 'mid', color: '#f59e0b' },
                        { index: end, label: 'end', color: '#ef4444' }
                    ]
                });
            }
        }
    }

    // Quick Sort
    async quickSort(arr, visualize = false, low = 0, high = null) {
        if (high === null) {
            this.reset();
            high = arr.length - 1;
        }
        
        if (low < high) {
            const pi = await this.partition(arr, visualize, low, high);
            await this.quickSort(arr, visualize, low, pi - 1);
            await this.quickSort(arr, visualize, pi + 1, high);
        }
        return arr;
    }

    async partition(arr, visualize, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            this.comparisons++;
            if (visualize) {
                let pointers = [
                    { index: low, label: 'low', color: '#3b82f6' },
                    { index: high, label: 'high/pivot', color: '#ef4444' },
                    { index: j, label: 'j', color: '#f59e0b' }
                ];
                if (i >= 0) {
                    pointers.push({ index: i, label: 'i', color: '#8b5cf6' });
                }
                this.steps.push({
                    type: 'compare',
                    indices: [j, high],
                    arrayState: [...arr],
                    pointers: pointers
                });
            }
            
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.swaps++;
                if (visualize) {
                    this.steps.push({
                        type: 'swap',
                        indices: [i, j],
                        arrayState: [...arr],
                        pointers: [
                            { index: low, label: 'low', color: '#3b82f6' },
                            { index: high, label: 'high/pivot', color: '#ef4444' },
                            { index: i, label: 'i', color: '#8b5cf6' },
                            { index: j, label: 'j', color: '#f59e0b' }
                        ]
                    });
                }
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.swaps++;
        if (visualize) {
            this.steps.push({
                type: 'swap',
                indices: [i + 1, high],
                arrayState: [...arr],
                pointers: [
                    { index: low, label: 'low', color: '#3b82f6' },
                    { index: high, label: 'high', color: '#ef4444' },
                    { index: i + 1, label: 'pivot_pos', color: '#10b981' }
                ]
            });
        }
        
        return i + 1;
    }
}

// Export for use in other files
const sortingAlgorithms = new SortingAlgorithms();
