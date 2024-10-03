# Package Version and Vulnerability Checker

## Overview
This application checks the package versions for a given set of software packages and identifies if they are on the N-1, N-2, or N-3 versions. It also checks for any vulnerabilities associated with these versions and outputs the results in a CSV file.


## CSV Output
The CSV file will include the following columns:
- `Platform` 
- `Package Name`
- `Projects`
- `Client Version`
- `Latest Stable Version`
- `Is on N-1 version`
- `N-1 Version`
- `N-1 Vulnerabilities`
- `N-2 Version`
- `N-2 Vulnerabilities`
- `N-3 Version`
- `N-3 Vulnerabilities`

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
    CATALOG=Fyour_tidelift_catalog
    NODE_ENV=dev
   ```
6. Run the application: `node src/main.js` in terminal 

This script processes packages and outputs the results to a CSV file in the `output` directory.



