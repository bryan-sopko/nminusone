const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const TideliftService = require('../api/tideliftAPI');

const OUTPUT_FILE = path.join(__dirname, '../output/output.csv');

const CacheService = {
    async loadCachedPackages() {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(OUTPUT_FILE)) {
                return resolve([]);
            }

            const cachedPackages = [];
            fs.createReadStream(OUTPUT_FILE)
                .pipe(csv())
                .on('data', (row) => {
                    if (row['platform'] && row['packageName'] && row['clientVersion']) {
                        cachedPackages.push({
                            platform: row['platform'],
                            packageName: row['packageName'],
                            clientVersion: row['clientVersion']
                        });
                        console.log("packages: "+ cachedPackages)
                    }
                })
                
                .on('end', () => resolve(cachedPackages))
                .on('error', reject);
        });
    },
};

module.exports = CacheService;
