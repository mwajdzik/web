function* makeRangeIterator(start = 0, end = 100, step = 1) {
    for (let i = start; i <= end; i += step) {
        yield i;
    }
}

let it = makeRangeIterator(1, 15, 2);
let result = it.next();

while (!result.done) {
    console.log(result.value);
    result = it.next();
}
