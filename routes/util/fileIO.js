const fs = require('fs');

function appendToFile(filename, data){
    console.log('appending to file');
    fs.writeFile(filename, data, { flag: 'a+' }, err => {});
}

function writeToFile(filename, data){
    console.log('overwriting file');
    fs.writeFile(filename, data, err => {});
}

async function readFile(filename){
    console.log(`read ${filename}`);
	return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8' , (err, data) => {
            resolve(data);
        });
    });
}

module.exports.appendToFile = appendToFile;
module.exports.readFile = readFile;
module.exports.writeToFile = writeToFile;