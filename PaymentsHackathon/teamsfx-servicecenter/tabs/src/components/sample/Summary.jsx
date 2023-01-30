import { useContext, useState, useEffect } from "react";
import "./Summary.css";
import { useData } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { getEmployeeSummaries, getEmployeeCustomers } from "./DataService.js";
import { Table } from "@fluentui/react-northstar";

export function Summary(props) {
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });
  const userName = (loading || error) ? "": data.displayName;

  const [summaries, setSummaries] = useState([userName]);
  useEffect(() => {
    getEmployeeSummaries(userName)
       .then((data) => {
          setSummaries(data);
       })
       .catch((err) => {
          console.log(err.message);
       });
    }, [userName]);

  const summaryheader = {
      items: ['Customer Count', 'Service Reqs', 'Revenue']
    }

  const [customers, setCustomers] = useState([userName]);
  useEffect(() => {
    getEmployeeCustomers(userName)
        .then((data) => {
          setCustomers(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, [userName]);

  const customersheader = {
    items: ['Service Record', 'VIN', 'First Name', 'Last Name', 'Phone', 'Email', 'Status']
  }
  
  return (
    <div className="welcome page">
        <h3 className="center">Welcome {userName ? ", " + userName : ""}!</h3>
        <h3 className="center">Here are your sales summaries</h3>
        <Table header={summaryheader} rows={summaries} />
        <br />
        <Table header={customersheader} rows={customers} />
    </div>
  );
}
