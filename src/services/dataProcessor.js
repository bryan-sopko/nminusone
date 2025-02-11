function mergeData(csvData, jsonData) {
    const mergedData = [];
    console.log(`CSV Data Length: ${csvData.length}`);
    console.log(`JSON Data Length: ${jsonData.length}`);
    //console.log("JSON: "+jsonData)
    csvData.forEach(csvRow => {
        
        jsonData.forEach(jsonItem => {
            if (jsonItem.direct_package === csvRow["Package Name"] && 
                jsonItem.platform === csvRow.Platform && 
                jsonItem.direct_version === csvRow["Client Version"]) {
                 console.log("Match Found");
                mergedData.push({...csvRow, ...jsonItem});
            }
        });
    });
    return mergedData;
}

module.exports = { mergeData };
