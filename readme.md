# Package Version and Vulnerability Checker

## Overview
This application checks the package versions for a given set of software packages and identifies if they are on the N-1, N-2, or N-3 versions. It also checks for any vulnerabilities associated with these versions and outputs the results in a CSV file.

## Features
- Fetches package versions from the Tidelift API.
- Determines if the current version is N-1, N-2, or N-3 from the latest stable version.
- Checks for vulnerabilities for each version and records them.
- Outputs the data into a CSV file with detailed columns for each package and its potential vulnerabilities.

## How to Run
1. Ensure Node.js and npm are installed on your system.
2. Clone the repository to your local machine.
3. Navigate to the project directory.
4. Install dependencies:
   ```bash
   npm install
   ```