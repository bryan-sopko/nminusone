require('dotenv').config({ path: '../.env' });
const TideliftService = require('./api/tideliftAPI');
const waitForReportCompletion = require('./utils/waitForReport');
const VersionLogic = require('./services/getPreviousVersion');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');
const { readCsv, readJson } = require('./services/fileReader');
const { mergeData } = require('./services/dataProcessor');
const { writeCsv } = require('./services/fileWriter');

console.log(readCsv, readJson);
console.time('executionTime')
const csvWriter = createCsvWriter({
    path: path.resolve(__dirname, 'output', 'output.csv'),
    header: [
        { id: 'platform', title: 'Platform' },
        { id: 'packageName', title: 'Package Name' },
        { id: 'projectsUsing', title: 'Projects' },
        { id: 'clientVersion', title: 'Client Version' },
        { id: 'latestVersion', title: 'Latest Stable Version' },
        { id: 'isNMinusOne', title: 'Is on N-1 version' },
        { id: 'nMinusOne', title: 'N-1 Version' },
        { id: 'nMinus1DiffMajor', title: 'N-1 Same Major?' },
        { id: 'nMinus1Vul', title: 'N-1 Vulnerabilities' },
        { id: 'nMinus1Sev', title: 'N-1 CVE Severity' },
        { id: 'nMinus1Rec', title: 'Recommendation' },
        { id: 'nMinusTwo', title: 'N-2 Version' },
        { id: 'nMinus2DiffMajor', title: 'N-2 Same Major?' },
        { id: 'nMinus2Vul', title: 'N-2 Vulnerabilities' },
        { id: 'nMinus2Sev', title: 'N-2 CVE Severity' },
        { id: 'nMinus2Rec', title: 'Recommendation' },
        { id: 'nMinusThree', title: 'N-3 Version' },
        { id: 'nMinus3DiffMajor', title: 'N-3 Same Major?' },
        { id: 'nMinus3Vul', title: 'N-3 Vulnerabilities' },
        { id: 'nMinus3Sev', title: 'N-3 CVE Severity' },
        { id: 'nMinus3Rec', title: 'Recommendation' },
    ]
});

// Delay function to enforce x amount of time between API calls
function delay(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}
async function combineReports(){
    try {
        const csvData = await readCsv('./output/output.csv');
        const jsonData = await readJson('./output/apv.json');
        const mergedData = mergeData(csvData, jsonData);
        writeCsv(mergedData, './output/mergedOutput.csv');
        console.log('Data has been merged and written successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    }

}
async function processReports() {
    
    try {
        const usageReport = await TideliftService.generateUsageReport();
        const completedReportId = await waitForReportCompletion(usageReport.report_id);
        const apvReport = await TideliftService.generateApvReport();
        const reportDetails = await TideliftService.fetchReport(completedReportId);
        const records = [];
        const limitedReportDetails = reportDetails.report;
        const packageCount = limitedReportDetails.length
        var count = 1
        for (const packageDetail of limitedReportDetails) {
            await delay(500);  // Wait for half a second before each call
            try{
            const record = await processPackage(packageDetail);
            if (record) records.push(record);
            } catch(error){
                console.error("Error processing package")
            }
            console.log("Packages complete: " + count + "/" + packageCount)
            count = count+1
        }

        const outputDir = path.resolve(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        await csvWriter.writeRecords(records);  // Write the records to the CSV file
        console.log('CSV file has been written successfully.');
        console.timeEnd('executionTime')
        combineReports();
    } catch (error) {
        console.error('Failed to process reports:', error);
    }
}

async function processPackage(packageDetail) {
    try {
        const packageName = packageDetail.package_name;
        const clientVersion = packageDetail.package_version;
        const platform = packageDetail.package_platform;
        const projectsUsing = packageDetail.projects_using;
        var severity;

        //console.log(`Processing ${packageName} on platform ${platform}`);

        // Fetching version list
        const versionList = await TideliftService.checkReleases(platform, packageName);
        if (!versionList || versionList.releases.length === 0) {
            console.log(`No version list found for ${packageName}. Skipping...`);
            return null;
        }

        // Retrieving versions with details
        const versionsData = await VersionLogic.getVersionsWithDetails(versionList.releases, false, 3);
        const clientMajor = VersionLogic.getMajorVersion(clientVersion);
        
        const record = {
            platform,
            packageName,
            projectsUsing,
            clientVersion,
            latestVersion: versionsData.latest,
            nMinusOne: versionsData.previousVersions[0] || '',
            nMinusTwo: versionsData.previousVersions[1] || '',
            nMinusThree: versionsData.previousVersions[2] || '',
            isNMinusOne: clientVersion === versionsData.previousVersions[0] ? 'Yes' : 'No',
        };

        // Fetching violations for each version and appending to the record
        for (let i = 0; i < versionsData.previousVersions.length; i++) {
            const version = versionsData.previousVersions[i];
            const nMajor = await VersionLogic.getMajorVersion(version);
            const isDiff = (nMajor == clientMajor) ? true : false
            const violations = await TideliftService.checkViolations(platform, packageName, version);
            var cveId
            var rec = ''
            if(violations.length > 0){
                violations.forEach(violation => {
                        if(violation.vulnerability){
                            cveId = violation.vulnerability.id

                        }

                })
                
            } 
            const violationDesc = violations.length > 0 ? violations.map(v => `${v.title} - Standard: ${v.catalog_standard}`).join('; ') : 'No violations';
            if(cveId != null){
                const cvePkg = await TideliftService.getReccomendations(cveId) 
                severity = parseSeverity(violations) 
                for(const pkg of cvePkg){
                   
                    if(pkg.name === packageName && pkg.platform == platform){
                        rec = pkg.recommendation + ' to ' + pkg.unaffected_versions
                        console.log(rec)
                    }
                }
                
            }

          
            record[`nMinus${i + 1}Vul`] = violationDesc;
            record[`nMinus${i + 1}Sev`] = severity;
            record[`nMinus${i + 1}Rec`] = rec;
            record[`nMinus${i + 1}DiffMajor`] = isDiff
        }
        return record;
    } catch (error) {
        console.error(`Error processing ${packageName}: ${error.message}`);
        return null;
    }
}
function parseSeverity(violations) {
    return violations
        .map(violation => {
            const match = violation.title.match(/severity (\d+\.\d+) is present/);
            return match ? match[1] : null;
        })
        .join('; ');  // Combine multiple severities with semicolon if necessary
}

processReports();
