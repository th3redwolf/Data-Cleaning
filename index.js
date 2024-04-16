const fs = require('fs'); // Importing file system
const csv = require('csv-parser'); // Importing csv-parser

class Cell {

    constructor() {

    }
}
// new object to store Cell objects
const cells = new Map();

// readable stream from 'cells.csv'
fs.createReadStream('cells.csv')
    
    .pipe(csv()) // converting csv data into js objects 
    .on('data', (row) => { // 'data' event for each row

    })
    .on('end', () => {
        console.log('CSV file succesfully read');
    });