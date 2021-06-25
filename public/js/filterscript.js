const fs = require('fs');

// fs.readFile('./followers.txt', 'utf8' , (err, data) => {
//     data = data.split(',');
//     console.log(data.length)
//     let lowerRange = 0;
//     let upperRange = 100000;
//     for(let i=1; i<=16; i++){
//         let subset = data.splice(lowerRange, upperRange);
//         let uniqueUsers = subset.filter(onlyUnique).join();
//         fs.writeFile(`./followers${i}.txt`, uniqueUsers, err => {
//             console.log(`file ${i} written`);
//         });
//     }
// });

function shuffleFile(index){
fs.readFile(`./followers${index}.txt`, 'utf8' , (err, data) => {
    data = shuffle(data.split(',')).join();
    fs.writeFile(`./followers${index}.txt`, data, err => {
        console.log(`file ${index} written shuffled`);
    });
});
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

shuffleFile(1);