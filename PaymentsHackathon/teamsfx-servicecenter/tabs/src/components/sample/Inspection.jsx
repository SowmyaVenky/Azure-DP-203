import { useContext, useState, useEffect } from "react";
import "./Summary.css";
import { useData } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { getEmployeeSummaries, getEmployeeCustomers } from "./DataService.js";
import {
    Form,
    FormInput,
    FormDropdown,
    FormCheckbox,
    FormDatepicker,
    FormButton,
    Flex
  } from '@fluentui/react-northstar';

export function Inspection(props) {
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });
  const userName = (loading || error) ? "": data.displayName;

  const [insDate, setInsDate] = useState("");
  let handleInsDateChange = (e) => {
    alert(e);
  }

  const [oil, setOil] = useState("Satisfactory");
  let handleOilChange = (e) => {
    alert(e);
  }
  
  let handleSubmit = async (e) => {
    /*
    for( let x = 0; x < e.target.elements.length; x++) {
        if( e.target.elements[x].value) {
          alert( e.target.elements[x].value );
        }
      }    
    */

    try {
        let res = await fetch("http://localhost:8080/inspectionsubmit", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            hello: 'world',
            firname: 'Venkata',
            insdate: insDate
          }),
        });
        //let resJson = await res.json();
        //alert(JSON.stringify(resJson));
        if (res.status === 200) {
            alert('Inspection data has been accepted!');
        } else {
            alert('oops');
        }
      } catch (err) {
        console.log(err);
      }

      return true;
  }

  return (
    <div className="welcome page">
        <h3 className="center">Welcome {userName ? ", " + userName : ""}!</h3>
        <h3 className="center">Inspection Capture Form</h3>
        <Flex>
        <Form method="POST" id='inspectionreportform' onSubmit={handleSubmit}>
        <Flex gap="gap.small">
          <FormDatepicker name='inspectiondate' label="Inspection date" required  onChange={handleInsDateChange}/>
        </Flex>
        <Flex gap="gap.small">
          <FormInput label="First name" name="firstName" id="first-name-inline" inline required  onChange={(e) => setInsDate(e.target.value)}/>
          <FormInput label="Last name" name="lastName" id="last-name-inline" inline required />
          <FormInput label="VIN" name="firstName" id="vin-inline" inline required />
          <FormInput label="Registration #" name="lastName" id="vrm-inline" inline required />
        </Flex>
          <h3>Fluid Levels</h3>
          <Flex gap="gap.small">
            <FormDropdown label="Oil"  value={oil} onChange={(item) => { alert(item); setOil(item);}} items={['Satisfactory', 'Needs Attention']}  />
            <FormDropdown label="Trasmission" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' required />
            <FormDropdown label="Washer" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' required />          
          </Flex>
          <h3>Internal (Engine Started)</h3>
          <Flex gap="gap.medium">
            <FormDropdown label="Fuel Level" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Horn" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Steering Wheel Feel" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
          </Flex>
          <Flex gap="gap.medium">
            <FormDropdown label="Foot Brake" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Parking Brake" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Heat/Defrost/AC" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
          </Flex>
          <Flex gap="gap.medium">
            <FormDropdown label="Interior Lights" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Upholstry" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Seat belts/Car seats" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
          </Flex>
          <h3>Exterior</h3>
          <Flex gap="gap.medium">
            <FormDropdown label="Head Lights" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Turn Signals" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Flashers" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
          </Flex>
          <Flex gap="gap.medium">
            <FormDropdown label="Dents/Scratches" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Tail Lights" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
            <FormDropdown label="Tires" items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
          </Flex>
          <FormCheckbox label="I agree to the Terms and Conditions" id="conditions-inline" required />
          <FormButton content="Submit" />          
        </Form>
        </Flex>
    </div>
  );
}
