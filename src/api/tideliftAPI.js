const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const { logger, logAxiosError } = require('../utils/logger');
const http = rateLimit(axios.create(), { maxRPS: 2 }); 
const API_BASE_URL = 'https://api.tidelift.com/external-api/v1/nam-demo-org';
const AUTH_TOKEN = process.env.TIDELIFT_ORG_TOKEN; // Use environment variable for security

const TideliftService = {
    async generateUsageReport() {
        const config = {
            method: 'post',
            url: `${API_BASE_URL}/reports/release_usage/generate?catalog_name=default`,
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await http.request(config);
            return response.data;
        } catch (error) {
            logAxiosError(error);
            throw error;
        }
    },
    async generateApvReport() {
        const config = {
            method: 'post',
            url: `${API_BASE_URL}/reports/all_projects_violations/generate?catalog_name=default`,
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await http.request(config);
            return response.data;
        } catch (error) {
            logAxiosError(error);
            throw error;
        }
    },

    async getReportStatus(reportId) {
        const config = {
            method: 'get',
            url: `${API_BASE_URL}/reports/release_usage/status?report_id=${reportId}`,
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        };
        try {
            const response = await http.request(config);
            return response.data;
        } catch (error) {
            logAxiosError(error);
            throw error;
        }
    },

    async fetchReport(reportId) {
        const config = {
            method: 'get',
            url: `${API_BASE_URL}/reports/release_usage?report_id=${reportId}`,
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        };
        try {
            const response = await http.request(config);
            return response.data;
        } catch (error) {
            logAxiosError(error);
            throw error;
        }
    },

    async checkReleases(platform, packageName) {
        const encodedPackageName = encodeURIComponent(packageName);
        const apiUrl = `https://api.tidelift.com/external-api/v1/packages/${platform}/${encodedPackageName}`;
        try {
            const response = await http.get(apiUrl, {
                headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                logger.info(`Package not found: ${packageName} on platform ${platform}`);
                return null; // Specifically handle 404 by returning null, indicating the package was not found
            } else {
                logAxiosError(error);
                return null; // Handle other errors similarly but log them as well
            }
        }
    },
    
    async checkViolations(platform, packageName, version) {
        const apiUrl = `https://api.tidelift.com/external-api/v1/packages/${platform}/${encodeURIComponent(packageName)}/releases/${version}`;
        try {
            const response = await http.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`
                }
            });
            return response.data.violations;
        } catch (error) {
            console.error('Error checking vulnerabilities:', error.response.status);
            throw error;
        }
    },
    async getReccomendations(cve) {
        console.log(cve)
        const apiUrl = `https://api.tidelift.com/external-api/v1/vulnerabilities/${cve}`;
        try {
            const response = await http.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${AUTH_TOKEN}`
                }
            });
            const rec = response.data.affected_packages;
            return rec;     
        } catch (error) {
            console.error('Error getting Recommenbdatiosn for CVE:', error.response.status);
            throw error;
        }
    }
};

module.exports = TideliftService;
