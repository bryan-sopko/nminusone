# Package Version and Vulnerability Checker

## Overview
This application checks the package versions for a given set of software packages and identifies if they are on the N-1, N-2, or N-3 versions. It also checks for any vulnerabilities associated with these versions and outputs the results in a CSV file.

## CSV Output
The CSV file will include all columns in the APV report along with the following columns:

- `project`
- `external_identifier`
- `branch`
- `catalog`
- `groups`
- `violation_type`
- `direct_package`
- `direct_version`
- `direct_version_published_at`
- `direct_package_is_unknown`
- `direct_purl`
- `platform`
- `violating_package`
- `violating_version`
- `violating_version_published_at`
- `violating_purl`
- `violation_first_introduced_at`
- `dependency_chain`
- `dependency_scope`
- `dependency_type`
- `action`
- `action_status`
- `action_recommendation`
- `recommended_dependency_chain`
- `violation_title`
- `violation_description`
- `violation_allowed`
- `violation_link`
- `vulnerability_id`
- `severity`
- `vulnerability_description`
- `vulnerability_date`
- `vulnerability_url`
- `severity_rating`
- `lifter_recommendations`
- `report_date`
- `Latest Stable Version`
- `Is on N-1 version`
- `N-1 Version`
- `N-1 Same Major?`
- `N-1 Vulnerabilities`
- `N-1 CVE Severity`
- `Recommendation`
- `N-2 Version`
- `N-2 Same Major?`
- `N-2 Vulnerabilities`
- `N-2 CVE Severity`
- `Recommendation`
- `N-3 Version`
- `N-3 Same Major?`
- `N-3 Vulnerabilities`
- `N-3 CVE Severity`
- `Recommendation`

### Special Cases
- If only one version of a package is released, other version-related columns will be blank.
- If N-1, N-2, or N-3 versions do not have violations but have vulnerabilities, they will still appear in the output.
- If a specific N-x version does not have a vulnerability, the corresponding column will be left blank.

### Caching Mechanism
- The application caches its output and, on subsequent runs, only processes the difference from the last execution.
- The first run will always take the longest since it processes all data.
- The caching mechanism looks for `output.csv` in the `output` folder and compares the stored package versions to detect differences.

## How to Run
1. Ensure Node.js and npm are installed on your system.
2. Clone the repository to your local machine.
3. Navigate to the project directory.
4. Install dependencies:
   ```bash
   npm install axios csv-writer dotenv
   ```
5. Set up a `.env` file in the project root with the necessary API credentials:
    ```bash
    TIDELIFT_ORG_TOKEN=your_tidelift_api_token_here
    ORGANIZATION=your_tidelift_org
    CATALOG=your_tidelift_catalog
    NODE_ENV=dev
    ```
6. Run the application:
   ```bash
   node src/main.js
   ```

This script processes packages and outputs the results to a CSV file in the `output` directory.
