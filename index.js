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
}

// new Map to store Cell objects
const cellMap = new Map();

// readable stream from 'cells.csv'
fs.createReadStream('cells.csv')
    
    .pipe(csv()) // converting csv data into js objects 
    .on('data', (row) => { // 'data' event for each row

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
        
        // body dimensions
        if (!row.body_dimensions || row.body_dimensions.trim() === '' || row.body_dimensions.trim() === '-') {
            row.body_dimensions = null;
        }
        else {row.body_dimensions = row.body_dimensions.replace(/-/g, ' ');}
        
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
        
        // body sim
        if (!row.body_sim || row.body_sim === 'No' || row.body_sim === 'Yes' || row.body_sim.trim() === '' || row.body_sim.trim() === '-') {
            row.body_sim = null;
        }
        else {row.body_sim = row.body_sim.replace(/[()]/g, '').replace(/-/g, ' ');} // remove (), replace dashes

        // display type
        if (!row.display_type || row.display_type.trim() === '') {
            row.display_type = null;
        }
        else {row.display_type = row.display_type.replace(/[^a-zA-Z0-9 ]/g, '');} // regex allows only alphanumerics (^) and spaces

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

        // display resolution
        if (!row.display_resolution || row.display_resolution.trim() === ''){
            row.display_resolution = null;
        }
        // else {row.display_resolution = row.display_resolution.replace(/[^a-zA-Z0-9 ]/g, '');}

        // features sensors
        if (!row.features_sensors || row.features_sensors.trim() === '' || !isNaN(row.features_sensors) && row.features_sensors !== 'V1') {
            row.features_sensors = null;
        }
        else {row.features_sensors = row.features_sensors.replace(/[^a-zA-Z0-9 ]/g, '');}

        // platform os
        if (!row.platform_os || row.platform_os.trim() === '' || !isNaN(row.platform_os)){
            row.platform_os = null;
        }
        else {
            // splitting entire string at first comma into substrings, then taking only first part [0] before comma
            let os = row.platform_os.split(',')[0].trim(); 
            row.platform_os = os;
        }

        const cell = new Cell(row.oem, row.model, row.launch_announced, row.launch_status, row.body_dimensions, row.body_weight, row.body_sim, row.display_type, row.display_size, row.display_resolution, row.features_sensors, row.platform_os);
        // console.log(cell); // printing each cell row
        console.log(JSON.stringify(cell, null, 2)); // printing each cell row
    })
    .on('end', () => {
        console.log('CSV file succesfully read');
    });



    // display type: took commas out
    // display size: cuts of anything after inches included
    // features_sensors: took out commas



    