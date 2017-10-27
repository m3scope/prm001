let arr = [], i =0;
function func() {
    console.log('FUNC !');
    // do {
    //     arr.push({a: Math.random(), b: Math.random(), c: Math.random()});
    //     console.log('DATA ADD !!!', i);
    //     i++;
    // } while (arr.length < 100);
}
do {
    arr.push({a: Math.random(), b: Math.random(), c: Math.random()});
    console.log('DATA ADD !!!', i);
    setTimeout(func, 1000);
    i++;
} while (arr.length < 100);
//setTimeout(func, 1000);
//func();
console.log(arr.length);