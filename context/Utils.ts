function getRandomItem<T>(array: T[]): T {
    return array[getRandomIndex(array.length)];
}

function getRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
}

export { getRandomItem, getRandomIndex };
