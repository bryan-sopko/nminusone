const { getReportStatus } = require('../api/tideliftAPI');

module.exports = async function waitForReportCompletion(reportId) {
    let status = await getReportStatus(reportId);
    
    while (status.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay
        status = await getReportStatus(reportId);
        console.log(`statusid ${status.status}`)
    }
    return reportId;
};
