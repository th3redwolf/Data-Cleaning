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

// new object to store Cell objects
// const cells = new Map();

// readable stream from 'cells.csv'
fs.createReadStream('cells.csv')
    
    .pipe(csv()) // converting csv data into js objects 
    .on('data', (row) => { // 'data' event for each row
        
        const cell = new Cell(row.oem, row.model, row.launch_announced, row.launch_status, row.body_dimensions, row.body_weight, row.body_sim, row.display_type, row.display_size, row.display_resolution, row.features_sensors, row.platform_os);
        // console.log(cell); // printing each cell row
        console.log(JSON.stringify(cell, null, 2)); // printing each cell row
    })
    .on('end', () => {
        console.log('CSV file succesfully read');
    });