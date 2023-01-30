export async function getEmployeeSummaries(employeeName)
{
    const response = await fetch (process.env.REACT_APP_API_BASE + `/summary?username=` + employeeName, {
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
    const response = await fetch (process.env.REACT_APP_API_BASE + `/monthlysummary?username=` + employeeName, {
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

export async function getEmployeeMonthlySummariesForGraph(employeeName)
{
    const response = await fetch (process.env.REACT_APP_API_BASE + `/monthlysummary?username=` + employeeName, {
        "method": "get",
        "cache": "default"
    });
    if (response.ok) {
        const employeeSummaries = await response.json();
        const returnmap = {};
        returnmap['title'] = { text : 'Sales Summaries' };

        const series1datapoints = [];
        const series2datapoints = [];
        const series3datapoints = [];

        const dataArr = [];
        dataArr.push({'type': 'line', showInLegend: true, legendText: "Revenue", 'dataPoints' : series1datapoints});
        dataArr.push({'type': 'line', showInLegend: true, legendText: "Customers", 'dataPoints' : series2datapoints});
        dataArr.push({'type': 'line', showInLegend: true, legendText: "Service Appointments", 'dataPoints' : series3datapoints});     
        
        for( let x = 0; x < employeeSummaries.length; x++) {
            const rfmtrow1 = {};            
            rfmtrow1['label'] = employeeSummaries[x].year + ' ' + employeeSummaries[x].month ;
            rfmtrow1['y'] = parseFloat(employeeSummaries[x].repaircost);
            series1datapoints.push(rfmtrow1);           
            
            const rfmtrow2 = {};            
            rfmtrow2['label'] = employeeSummaries[x].year + ' ' + employeeSummaries[x].month ;
            rfmtrow2['y'] = parseFloat(employeeSummaries[x].custcount) * Math.floor(Math.random() * (300 - 200 + 1) + 200);
            series2datapoints.push(rfmtrow2);            

            const rfmtrow3 = {};            
            rfmtrow3['label'] = employeeSummaries[x].year + ' ' + employeeSummaries[x].month ;
            rfmtrow3['y'] = parseFloat(employeeSummaries[x].service_recs) * Math.floor(Math.random() * (300 - 200 + 1) + 200);
            series3datapoints.push(rfmtrow3);
        }

        returnmap['data'] = dataArr;
        return returnmap;
    } else {
        const error = await response.json();
        console.log (`ERROR: ${error}`);
        throw (error);
    }    
}

export async function getEmployeeCustomers(employeeName)
{
    const response = await fetch (process.env.REACT_APP_API_BASE + `/mycustomers?username=` + employeeName, {
        "method": "get",
        "cache": "default"
    });
    if (response.ok) {
        const employeeSummaries = await response.json();
        const rowsPlain = [];
        for( let x = 0; x < employeeSummaries.length; x++) {
            const rfmtrow = {};
            const rowcols = [];
            
            rowcols.push(employeeSummaries[x].firstname);
            rowcols.push(employeeSummaries[x].lastname);
            rowcols.push(employeeSummaries[x].address + ' ' + employeeSummaries[x].address2 + ' ' + employeeSummaries[x].city + ' ' + employeeSummaries[x].state + ' ' + employeeSummaries[x].zip);
            rowcols.push(employeeSummaries[x].phone);
            rowcols.push(employeeSummaries[x].email);
            //rowcols.push(employeeSummaries[x].creditcard);

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