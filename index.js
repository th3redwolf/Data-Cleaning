const fs = require('fs'); // Importing file system
const csv = require('csv-parser'); // Importing csv-parser

class Cell {

    constructor(oem, model, launch_announced, launch_status, body_dimensions, body_weight, body_sim, display_type, display_size, display_resolution, features_sensors, platform_os) {
        this._oem = oem;
        this._model = model;
        this._launch_announced = parseInt(launch_announced);
        this._launch_status = launch_status;
        this._body_dimensions = body_dimensions;
        this._body_weight = parseFloat(body_weight);
        this._body_sim = body_sim;
        this._display_type = display_type;
        this._display_size = parseFloat(display_size);
        this._display_resolution = display_resolution;
        this._features_sensors = features_sensors;
        this._platform_os = platform_os; 
    }

    get oem() {
        return this._oem;
    }
    set oem(value) {
        this._oem = value;
    }

    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
    }

    get launch_announced() {
        return this._launch_announced;
    }
    set launch_announced(value) {
        this._launch_announced = value;
    }

    get launch_status() {
        return this._launch_status;
    }
    set launch_status(value) {
        this._launch_status = value;
    }

    get body_dimensions() {
        return this._body_dimensions;
    }
    set body_dimensions(value) {
        this._body_dimensions = value;
    }

    get body_weight() {
        return this._body_weight;
    }
    set body_weight(value) {
        this._body_weight = value;
    }

    get body_sim() {
        return this._body_sim;
    }
    set body_sim(value) {
        this._body_sim = value;
    }

    get display_type() {
        return this._display_type;
    }
    set display_type(value) {
        this._display_type = value;
    }

    get display_size() {
        return this._display_size;
    }
    set display_size(value) {
        this._display_size = value;
    }

    get display_resolution() {
        return this._display_resolution;
    }
    set display_resolution(value) {
        this._display_resolution = value;
    }

    get features_sensors() {
        return this._features_sensors;
    }
    set features_sensors(value) {
        this._features_sensors = value;
    }

    get platform_os() {
        return this._platform_os;
    }
    set platform_os(value) {
        this._platform_os = value;
    }

    toJSON() {
        return {
            oem: this._oem,
            model: this._model,
            launch_announced: this._launch_announced,
            launch_status: this._launch_status,
            body_dimensions: this._body_dimensions,
            body_weight: this._body_weight,
            body_sim: this._body_sim,
            display_type: this._display_type,
            display_size: this._display_size,
            display_resolution: this._display_resolution,
            features_sensors: this._features_sensors,
            platform_os: this._platform_os
        }
    }

    // 8 methods / functions

    // each column convert to string for printing
    // with js 'toString()' method
    toString() {
        return `OEM: ${this.oem}, Model: ${this.model}, 
                Launch Announced: ${this.launch_announced}, 
                Launch Status: ${this.launch_status}, 
                Body Dimensions: ${this.body_dimensions}, 
                Body Weight: ${this.body_weight}, 
                Body SIM: ${this.body_sim}, 
                Display Type: ${this.display_type}, 
                Display Size: ${this.display_size}, 
                Display Resolution: ${this.display_resolution}, 
                Features Sensors: ${this.features_sensors}, 
                Platform OS: ${this.platform_os}`;
    }

    // mean weight of 1 individual oem
    static calcMeanWeight(cells, oem) {
        // some basic error handling
        if (typeof oem !== 'string'){
            throw new Error('oem should be a string');
        }
        try {
            // filtering through all phones, 
            // then mapping through / getting each weight into array weights
            // + making sure weight is a number
            let weights = cells
                .filter(cell => cell.oem === oem && !isNaN(cell.body_weight))
                .map(cell => parseFloat(cell.body_weight));
            if (weights.length === 0){
                return 0;
            }
            // a = accumulator, b = 1st element in array, 0 = initial value (a)
            let sum = weights.reduce((a, b) => a + b, 0); 
            return sum / weights.length;
        }
        catch (error) {
            console.error(`There was an error calculating mean weight: ${error.message}`);
        }
    }

    // Q1 highest average weight
    static highestAvgWeight(cells) {
        try {
            if (!Array.isArray(cells)) {
                throw new Error('input should be an array');
            }
            // mapping in array all oems
            let oems = [...new Set(cells.map(cell => cell.oem))];
            let maxAvgWeight = 0;
            let maxOem = '';

            // getting each avg weight by calling calcMeanWeight()
            // getting highest avg weight by comparing 
            for (let oem of oems) {
                let avgWeight = Cell.calcMeanWeight(cells, oem);
                if (avgWeight > maxAvgWeight) {
                    maxAvgWeight = avgWeight;
                    maxOem = oem;
                }
            }
            return {oem: maxOem, weight: maxAvgWeight};
        }
        catch (error) {
            console.error(`error finding highest avg weight: ${error.message}`);
        }
    }

    // delayed launches (released in different year than announced)
    static delayedLaunches(cells) {
        // some error handling
        if (!Array.isArray(cells)) {
            throw new Error('Input should be an array');
        }
        let delayedPhones = [];

        for (let cell of cells) {
            // error handling
            try {
                // retrieving dates (years) with getFullYear method
                let yearAnnounced = new Date(cell['launch_announced']).getFullYear();
                let yearStatus = new Date(cell['launch_status']).getFullYear();

                if (yearAnnounced !== yearStatus) {
                    // checking which years differ, saving OEM and model of each
                    delayedPhones.push(`OEM: ${cell['oem']}, Model: ${cell['model']}`);
                }
            }
            catch (error) {
                console.error(`Error when processing cell: ${error.message}`);
            }
        }

        return delayedPhones.join('\n')
    }

    // feature sensor counter
    static oneFeatureSensor(cells) {
        // splits at each comma all elements into substrings, checks which has 1 element, returns sum 
        return cells.filter(cell => cell.features_sensors.split(',').length === 1).length;
    }

    // year most phones launched
    static mostLaunchesYear(cells) {
        // checking each launch if after 1999, mapping to array all years > 99
        let years = cells.filter(cell => cell.launch_status > 1999).map(cell => cell.launch_status);
        let counts ={}; // object to count occurrences, key=years, value=count
        // for each year that exists, if first encounter => 0 + 1, 
        // if encountered before => its count is incremented 
        years.forEach(year => counts[year] = (counts[year] || 0) +1);
        // returns count array props, reduce finds highest count, 
        // comparing each key(year) value(count) pair 
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    // unique column values
    static uniqueValues(cells, column) {
        try {
            if (!Array.isArray(cells)){
                throw new Error('input shouldve been an array');
            }
            if (typeof column !== 'string'){
                throw new Error('column should be a string');
            }
            // mapping new array containing values of column
            // 'Set' only allows unique values, duplicates are discarded
            // using spread op to create new array from Set (Set object != arrays)
            return [...new Set(cells.map(cell => cell[column]))];
        }
        catch (error) {
            console.error(`error retrieving unique values: ${error.message}`);
        }
    } 

    // calc median
    static calcMedian(cells, column) {
        try {
            if (!Array.isArray(cells)) {
                throw new Error('expected an array');
            }
            if (typeof column !== 'string'){
                throw new Error('expected column to be a string');
            }
            // for median first need to sort (ascending order)
            let values = cells.map(cell => cell[column]).sort((a, b) => a - b);
            // then can get mid point
            let mid = Math.floor(values.length / 2);
            // then if entire length has no remainder (even), 
            // add both mid points & divide by 2 to get median,
            // if remainder (odd) midpoint = median
            return values.length % 2 === 0 ? (values[mid -1] + values[mid + 1]) / 2 : values[mid];
        }
        catch (error) {
            console.error(`error when calculating the median: ${error.message}`);
        }
    }
}

// new Map to store Cell objects
const cellMap = new Map();
let index = 0;

// readable stream from 'cells.csv'
fs.createReadStream('cells.csv')
    
    .pipe(csv()) // converting csv data into js objects 
    .on('data', (row) => { // 'data' event for each row

        // some error handling while going thru each row
        try {

            // cleaning all data

            // oem
            if (!row.oem || row.oem.trim() === '' || row.oem.trim() === '-'){
                row.oem = null;
            }
            else {row.oem = row.oem.replace(/-/g, ' ');} // replace all (g/lobal) dashes with space
            
            // model
            if (!row.model || row.model.trim() === '' || row.oem.trim() === '-'){
                row.model = null;
            }
            else {row.model = row.model.replace(/-/g, ' ');}
            
            // launch anounced
            if (row.launch_announced) {
                // matching sequence with 4 digits (d{4}), \b\b = boundary
                let year = row.launch_announced.match(/\b\d{4}\b/);
                if (year) {
                    row.launch_announced = Number(year[0]); // string to numb
                }
                else {row.launch_announced = null;}
            }
            else {row.launch_announced = null;}
        }
        catch (error) {
            console.error(`error processing row: ${error.message}`);
        }

        try {
            // launch status
            if (row.launch_status) {

                // let year = row.launch_status.match(/\b\d{4}\b/);
                // let disc = row.launch_status.match('Discontinued');
                // let cancl = row.launch_status.match('Cancelled');
                if (row.launch_status === 'Discontinued' || row.launch_status === 'Cancelled') {
                    // we leave as is
                }
                else {
                    let year = row.launch_status.match(/\b\d{4}\b/);
                    if (year) {row.launch_status = Number(year[0]);}
                    else {row.launch_status = null;}
                }
            }
            else {row.launch_status = null;}
        }
        catch (error) {
            console.error(`error processing launch status: ${error.message}`);
        }
        
        try {
            // body dimensions
            if (!row.body_dimensions || row.body_dimensions.trim() === '' || row.body_dimensions.trim() === '-') {
                row.body_dimensions = null;
            }
            else {row.body_dimensions = row.body_dimensions.replace(/-/g, ' ');}
        }
        catch (error) {
            console.error(`error processing body dimensions: ${error.message}`);
        }
        
        try {
            // body weight
            if (row.body_weight && row.body_weight.trim() !== '-') {
                // extracting numeric part, matching 1 or more digits (\d+), and continuing check for decimals (.\d+?)
                let weight = row.body_weight.match(/\d+(\.\d+)?/); 
                if (weight) {
                    // converting string to number (inclduing decimals (\.\d+)?)
                    row.body_weight = Number(weight[0]); 
                }
                else {row.body_weight = null;}
            }
            else {row.body_weight = null;}
        }
        catch (error) {
            console.error(`error processing body weight: ${error.message}`);
        }
        
        try {
            // body sim
            if (!row.body_sim || row.body_sim === 'No' || row.body_sim === 'Yes' || row.body_sim.trim() === '' || row.body_sim.trim() === '-') {
                row.body_sim = null;
            }
            else {row.body_sim = row.body_sim.replace(/[()]/g, '').replace(/-/g, ' ');} // remove (), replace dashes
        }
        catch (error) {
            console.error(`error processing body sim: ${error.message}`);
        }

        try{
            // display type
            if (!row.display_type || row.display_type.trim() === '') {
                row.display_type = null;
            }
            else {row.display_type = row.display_type.replace(/[^a-zA-Z0-9, ]/g, '');} // regex allows only alphanumerics (^) and spaces
        }
        catch (error) {
            console.error(`error processing display type: ${error.message}`);
        }

        try{
            // display_size
            if (!row.display_size || row.display_size.trim() === '' || !isNaN(row.display_size)) {
                row.display_size = null;
            }
            else {
                // row.display_size = row.display_size.replace(/[()]/g, '').replace(/-/g, ' ');
                // let size = parseFloat(row.display_size);
                let size = row.display_size.match(/[\d\.]+ inches/);
                if (size){
                    let numeric = size[0].split(" ")[0];
                    let float = parseFloat(numeric); // converting string to float
                    row.display_size = isNaN(float) ? null : numeric; // wasn't sure if to add the word 'inches' or not
                }
                else {row.display_size = null;}
            }
        }
        catch (error) {
            console.error(`error processing display size: ${error.message}`);
        }

        try{
            // display resolution
            if (!row.display_resolution || row.display_resolution.trim() === ''){
                row.display_resolution = null;
            }
            // else {row.display_resolution = row.display_resolution.replace(/[^a-zA-Z0-9, ]/g, '');}
        }
        catch (error) {
            console.error(`error processing display resolution: ${error.message}`);
        }

        try{
            // features sensors
            if (!row.features_sensors || row.features_sensors.trim() === '' || !isNaN(row.features_sensors) && row.features_sensors !== 'V1') {
                row.features_sensors = null;
            }
            else {row.features_sensors = row.features_sensors.replace(/[^a-zA-Z0-9, ]/g, '');}
        }
        catch (error) {
            console.error(`error processing features sensors: ${error.message}`);
        }    

        try{
            // platform os
            if (!row.platform_os || row.platform_os.trim() === '' || !isNaN(row.platform_os)){
                row.platform_os = null;
            }
            else {
                // splitting entire string at first comma into substrings, then taking only first part [0] before comma
                let os = row.platform_os.split(',')[0].trim(); 
                row.platform_os = os;
            }
        }
        catch (error) {
            console.error(`error processing platform os: ${error.message}`);
        }

        const cell = new Cell(row.oem, row.model, row.launch_announced, row.launch_status, row.body_dimensions, row.body_weight, row.body_sim, row.display_type, row.display_size, row.display_resolution, row.features_sensors, row.platform_os);
        cellMap.set(index, cell);
        index++;

        //console.log(JSON.stringify(cell, null, 2)); // printing each cell row
        // console.log(JSON.stringify(Array.from(cellMap.entries()), null, 2));

    })
    .on('end', () => {
        //console.log(cellMap);
        console.log('CSV file succesfully read');

        // converting cellMap to array of Cell (class) objects
        let cells = Array.from(cellMap.values());

        // 4 questions

        // delayed launches, oem + models
        let launchDelayed = Cell.delayedLaunches(cells);
        // OEM with highest average weight
        let avgWeightHighest = Cell.highestAvgWeight(cells);
        // how many have one feature sensor
        let singleSensorAmount = Cell.oneFeatureSensor(cells);
        // year with most phones launched
        let mostLaunches = Cell.mostLaunchesYear(cells);

        // displaying results
        console.log(`\nLaunched different Year:\n\n${launchDelayed}`);
        //console.log(`\nOEM with Highest Average Weight: ${avgWeightHighest.oem},\nWeight: ${avgWeightHighest.weight}`);
        //console.log(`\nNumber of phones with 1 Feature Sensor: ${singleSensorAmount}`);
        //console.log(`\nYear with most launches: ${mostLaunches}`);
    });


module.exports = {cellMap, Cell};
// module.exports = {cellMap, calcMeanWeight, highestAvgWeight, delayedLaunches, oneFeatureSensor, mostLaunchesYear, uniqueValues, calcMedian};