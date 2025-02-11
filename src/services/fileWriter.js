
const fs = require('fs');
const { parse } = require('json2csv');

async function writeCsv(data) {
  const fields = [
    'project', 'external_identifier', 'branch', 'catalog', 'groups', 'violation_type', 'direct_package', 'direct_version',
    'direct_version_published_at', 'direct_package_is_unknown', 'direct_purl', 'platform', 'violating_package',
    'violating_version', 'violating_version_published_at', 'violating_purl', 'violation_first_introduced_at', 
    'dependency_chain', 'dependency_scope', 'dependency_type', 'action', 'action_status', 'action_recommendation', 
    'recommended_dependency_chain', 'violation_title', 'violation_description', 'violation_allowed', 'violation_link',
    'vulnerability_id', 'severity', 'vulnerability_description', 'vulnerability_date', 'vulnerability_url',
    'severity_rating', 'lifter_recommendations', 'report_date', 'Latest Stable Version', 'Is on N-1 version','N-1 Version', 
    'N-1 Same Major?',  'N-1 Vulnerabilities',  'N-1 CVE Severity', 'Recommendation',  'N-2 Version', 'N-2 Same Major?', 'N-2 Vulnerabilities',
    'N-2 CVE Severity','Recommendation',  'N-3 Version',  'N-3 Same Major?',  'N-3 Vulnerabilities',  'N-3 CVE Severity','Recommendation']


  const opts = { fields };
  try {
    console.log(data)
    const csv = parse(data, opts);
    fs.writeFileSync('./output/Combinedoutput.csv', csv);
    console.log('CSV file has been written successfully');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

module.exports = { writeCsv };
