import { useContext, useState, useEffect } from "react";
import "./MonthlySummary.css";
import { useData } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { getEmployeeMonthlySummaries, getEmployeeMonthlySummariesForGraph } from "./DataService.js";
import { Table, Header, Divider } from "@fluentui/react-northstar";
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export function MonthlySummary(props) {
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });
  const userName = (loading || error) ? "": data.displayName;

  const [monthlysummaries, setMonthlySummaries] = useState([userName]);
    useEffect(() => {
      getEmployeeMonthlySummaries(userName)
         .then((data) => {;
          setMonthlySummaries(data);
         })
         .catch((err) => {
            console.log(err.message);
         });
      }, [userName]);

  const [monthlysummariesgraph, setMonthlySummariesGraph] = useState([userName]);
    useEffect(() => {
      getEmployeeMonthlySummariesForGraph(userName)
          .then((data) => {;
            setMonthlySummariesGraph(data);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }, [userName]);
  
      const monthlysummaryheader = {
        items: ['Year', 'Month', 'Customer Count', 'Service Appointments', 'Revenue'],
      }

      //alert(JSON.stringify(monthlysummariesgraph));
  return (
    <div className="welcome page">
      <Divider color="brand" content="Service Request Summary for February" size={3} important/>

        <CanvasJSChart options = {monthlysummariesgraph} />
        <br />
        <Table compact header={monthlysummaryheader} rows={monthlysummaries} />        
    </div>
  );
}
