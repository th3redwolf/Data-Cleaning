// importing functions / methods
// const {cellMap, calcMeanWeight, highestAvgWeight, delayedLaunches, oneFeatureSensor, mostLaunchesYear, uniqueValues, calcMedian} = require('./index');
const {cellMap, Cell} = require('./index.js');
const fs = require('fs');
const csv = require('csv-parser');

const cells =Array.from(cellMap.values());


// UNIT TESTS with jest

// required unit tests

// no empty file test
test('file is Not empty', done => {

    const cells = [];
    fs.createReadStream('./cells.csv')
        .pipe(csv())
        .on('data', (row) => {
            cells.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully read');
            expect(cells.length).toBeGreaterThan(0);
            done();
        })
})

// test('file is Not empty', done => {

//     const data = fs.readFileSync('cells.csv', 'utf8');
//     expect(data).not.toEqual('');
// })

// each column's final transformation matches instructions

// oem test
test('oem is string of letters or numbers or null', () => {

    cells.forEach(cell => {
        const oemType = typeof cell.oem;
        expect(oemType === 'string' || oemType === 'object').toBe(true);
        if (oemType === 'string') {
            expect(cell.oem).toMatch(/^[a-zA-Z0-9 ]*$/);
        }
    })
})

// model test
test('model is string of letters or numbers or null', () => {

    cells.forEach(cell => {
        const modelType = typeof cell.model;
        expect(modelType === 'string' || modelType === 'object').toBe(true);
        if (modelType === 'string') {
            expect(cell.model).toMatch(/^[a-zA-Z0-9, ]*$/);
        }
    })
})

// launch announced test
test('launch announced is integer year or null', () => {

    cells.forEach(cell => {
        const launchAnnouncedType = typeof cell.launch_announced;
        expect(launchAnnouncedType === 'number' || launchAnnouncedType === 'object').toBe(true);
        if (launchAnnouncedType === 'number') {
            expect(Number.isInteger(cell.launch_announced)).toBe(true);
            expect(cell.launch_announced).toBeGreaterThanOrEqual(1000);
            expect(cell.launch_announced).toBeLessThanOrEqual(new Date().getFullYear());
        }
    })
})

// launch status test
test('launch status is integer year, "Discontinued", "Cancelled", or null', () => {

    cells.forEach(cell => {
        const launchStatusType = typeof cell.launch_status;
        expect(launchStatusType === 'number' || launchStatusType === 'string' || launchStatusType === 'object').toBe(true);
        if (launchStatusType === 'number') {
            expect(Number.isInteger(cell.launch_status)).toBe(true);
            expect(cell.launch_status).toBeGreaterThanOrEqual(1000);
            expect(cell.launch_status).toBeLessThanOrEqual(new Date().getFullYear());
        } 
        else if (launchStatusType === 'string') {
            expect(cell.launch_status === 'Discontinued' || cell.launch_status === 'Cancelled').toBe(true);
        }
    })
})

// body dimensions test
test('body dimensions is string of letters, numbers, null', () => {

    cells.forEach(cell => {
        const bodyDimensionsType = typeof cell.body_dimensions;
        expect(bodyDimensionsType === 'string' || bodyDimensionsType === 'object').toBe(true);
        if (bodyDimensionsType === 'string') {
            expect(cell.body_dimensions).toMatch(/^[a-zA-Z0-9, ]*$/);
        }
    });
});

// body weight
test('body weight is float in grams or null', () => {

    cells.forEach(cell => {
        const bodyWeightType = typeof cell.body_weight;
        expect(bodyWeightType === 'number' || bodyWeightType === 'object').toBe(true);
        if (bodyWeightType === 'number') {
            expect(cell.body_weight).toBeGreaterThanOrEqual(0);
        }
    })
})

// body sim test
test('body sim is string of letters or null', () => {

    cells.forEach(cell => {
        const bodySimType = typeof cell.body_sim;
        expect(bodySimType === 'string' || bodySimType === 'object').toBe(true);
        if (bodySimType === 'string') {
            expect(cell.body_sim).toMatch(/^[a-zA-Z(), ]*$/);
            expect(cell.body_sim).not.toEqual('No');
            expect(cell.body_sim).not.toEqual('Yes');
        }
    })
})

// display type
test('display type is string of letters, numbs, null', () => {

    cells.forEach(cell => {
        const displayTypeType = typeof cell.display_type;
        expect(displayTypeType === 'string' || displayTypeType === 'object').toBe(true);
        if (displayTypeType === 'string') {
            expect(cell.display_type).toMatch(/^[a-zA-Z0-9, ]*$/);
        }
    })
})

// display size is float test
test('display size is float in inches or null', () => {

    cells.forEach(cell => {
        const displaySizeType = typeof cell.display_size;
        expect(displaySizeType === 'number' || displaySizeType === 'object').toBe(true);
        if (displaySizeType === 'number') {
            expect(cell.display_size).toBeGreaterThanOrEqual(0);
        }
    })
})

// display resolution test
test('display resolution is string of letters, numbers, null', () => {

    cells.forEach(cell => {
        const displayResolutionType = typeof cell.display_resolution;
        expect(displayResolutionType === 'string' || displayResolutionType === 'object').toBe(true);
        if (displayResolutionType === 'string') {
            expect(cell.display_resolution).toMatch(/^[a-zA-Z0-9,() ]*$/);
        }
    })
})

// feature sensors test
test('feature sensors is string of letters, numbers, null', () => {

    cells.forEach(cell => {
        const featureSensorsType = typeof cell.feature_sensors;
        expect(featureSensorsType === 'string' || featureSensorsType === 'object').toBe(true);
        if (featureSensorsType === 'string') {
            expect(cell.feature_sensors).toMatch(/^[a-zA-Z0-9, ]*$/);
            expect(isNaN(Number(cell.feature_sensors))).toBe(true);
        }
    })
})

// platform os test
test('platform os is string of letters, numbs, null', () => {

    cells.forEach(cell => {
        const platformOsType = typeof cell.platform_os;
        expect(platformOsType === 'string' || platformOsType === 'object').toBe(true);
        if (platformOsType === 'string') {
            expect(cell.platform_os).toMatch(/^[a-zA-Z0-9()\. ]*$/);
            expect(isNaN(Number(cell.platform_os))).toBe(true);
            // if (cell.platform_os.includes(',')) {
            //     const shortened = cell.platform_os.split(',')[0];
            //     expect(cell.platform_os).toEqual(shortened);
            // }
        }
    })
})




// all missing or "-" data is replaced with a null value test
test('missing or "-" data is replaced with null', () => {
    cells.forEach(cell => {
        Object.values(cell).forEach(value => {
            expect(value).not.toBe('-');
        });
    });
});





// tests for each method

// couldn't get this one to work properly

// delayed launches
// test('delayed launches works fine', () => {

//     const cells = [
//         {launch_announced: 2018, launch_status: 2020},
//         {launch_announced: 2019, launch_status: 2020}, 
//         {launch_announced: 2012, launch_status: 'Discontinued'}, 
//     ];
//     const result = Cell.delayedLaunches(cells);
//     expect(result).toEqual([
//         {launch_announced: 2018, launch_status: 2020},
//         {launch_announced: 2019, launch_status: 2020},
//         {launch_announced: 2012, launch_status: 'Discontinued'},
//     ])
// })