export async function getEmployeeSummaries(employeeName)
{
    const response = await fetch (`http://localhost:8080/summary?username=` + employeeName, {
        "method": "get",
        "cache": "default"
    });
    if (response.ok) {
        const employeeSummaries = await response.json();
        const rowsPlain = [];
        for( let x = 0; x < employeeSummaries.length; x++) {
            const rfmtrow = {};
            const rowcols = [];
            
            rowcols.push(employeeSummaries[x].custcount);
            rowcols.push(employeeSummaries[x].service_recs);
            rowcols.push(employeeSummaries[x].repaircost);

            rfmtrow['key'] = x;
            rfmtrow['items'] = rowcols;
            rowsPlain.push(rfmtrow);            
        }
        return rowsPlain;
    } else {
        const error = await response.json();
        console.log (`ERROR: ${error}`);
        throw (error);
    }    
}

export async function getEmployeeMonthlySummaries(employeeName)
{
    const response = await fetch (`http://localhost:8080/monthlysummary?username=` + employeeName, {
        "method": "get",
        "cache": "default"
    });
    if (response.ok) {
        const employeeSummaries = await response.json();
        const rowsPlain = [];
        for( let x = 0; x < employeeSummaries.length; x++) {
            const rfmtrow = {};
            const rowcols = [];
            
            rowcols.push(employeeSummaries[x].year);
            rowcols.push(employeeSummaries[x].month);
            rowcols.push(employeeSummaries[x].custcount);
            rowcols.push(employeeSummaries[x].service_recs);
            rowcols.push(employeeSummaries[x].repaircost);

            rfmtrow['key'] = x;
            rfmtrow['items'] = rowcols;
            rowsPlain.push(rfmtrow);            
        }
        return rowsPlain;
    } else {
        const error = await response.json();
        console.log (`ERROR: ${error}`);
        throw (error);
    }    
}
