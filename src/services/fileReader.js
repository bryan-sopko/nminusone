const fs = require('fs');
const csv = require('csv-parser');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function readCsv(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

async function readJson(filePath) {
    const data = await readFile(filePath, 'utf8');
    const json = JSON.parse(data);
    return json.report;  // Adjust this line based on the actual structure
}

module.exports = { readCsv, readJson };
