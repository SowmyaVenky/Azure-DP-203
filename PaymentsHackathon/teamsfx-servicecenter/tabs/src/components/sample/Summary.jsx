import { useContext, useState, useEffect } from "react";
import "./Summary.css";
import { useData } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { getEmployeeSummaries, getEmployeeCustomers } from "./DataService.js";
import { Table, Header, Divider, Button, CallVideoIcon } from "@fluentui/react-northstar";

export function Summary(props) {
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });
  const userName = (loading || error) ? "": data.displayName;
  const today = new Date(); 
  const hour = today.getHours(); 
  const greetings = (hour < 12) ? "Good Morning" : "Good Afternoon"; 
  const pageGreeting = greetings + " " + userName;

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
      <Header className="center" as="h2" color="brand" content={pageGreeting} />
      <Divider color="brand" content="Here are your assignments" size={3} important/>
      <Table header={customersheader} rows={customers} compact/>    
    </div>
  );
}
