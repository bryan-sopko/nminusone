const VersionLogic = {
    getVersionsWithDetails(releases, includePreReleases = false, count = 3) {
        if (!releases || releases.length === 0) {
            return { latest: null, previousVersions: [] };
        }
        // Filter based on pre-release condition and immediately return the needed versions
        const filteredReleases = releases.filter(release => includePreReleases || (!release.version.includes('RC') && !release.version.includes('M') && !release.version.includes('alpha') && !release.version.includes('beta')));

        const latest = filteredReleases.length > 0 ? filteredReleases[0].version : null;
        const previousVersions = filteredReleases.slice(1, count + 1).map(release => release.version);

        return {
            latest,
            previousVersions
        };
    }
};
module.exports = VersionLogic;
