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
    Flex, 
    Header,
    Divider
  } from '@fluentui/react-northstar';

import { useHistory } from "react-router-dom";

export function Inspection(props) {
  const history = useHistory();
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });
  const userName = (loading || error) ? "": data.displayName;
  const [inputs, setInputs] = useState({});

  const [insDate, setInsDate] = useState("");
  let handleInsDateChange = (e, v) => {
    const name = "inspectionDate";
    setInputs(values => ({...values, [name]: v.value}))
    // alert( JSON.stringify(inputs));
  }

  const handleDropChange = (event, v) => {
    // alert("bingo " + event + JSON.stringify(v));
    setInputs(values => ({...values, [v.name]: v.value}))
    // alert( JSON.stringify(inputs));
  }
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // alert("name " + name);
    setInputs(values => ({...values, [name]: value}))
    // alert( JSON.stringify(inputs));
  }
  
  let handleSubmit = async (e) => {
    e.preventDefault();
    const fieldName = "userName";
    let serviceRecord = {...inputs, [fieldName]: userName};

    // alert( JSON.stringify(serviceRecord));

    try {
        let res = await fetch(process.env.REACT_APP_API_BASE + "/inspectionsubmit", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(serviceRecord),
          // body: JSON.stringify({
          //   hello: 'world',
          //   firname: 'Venkata',
          //   insdate: insDate
          // }),
        });
        //let resJson = await res.json();
        //alert(JSON.stringify(resJson));
        if (res.status === 200) {          
          history.push("/summary");
        } else {
            alert('Unexpected error has occurred.');
        }
      } catch (err) {
        alert(err);
      }

      return true;
  }

  return (
    <div className="welcome page">
         <Divider color="brand" content="Inspection Capture Form" size={3} important/>

        <Flex>
          <Form method="POST" id='inspectionreportform' onSubmit={handleSubmit}>
            <Flex gap="gap.small">
              <FormDatepicker label="Inspection date" required  onDateChange={handleInsDateChange}/>
            </Flex>
            <Flex gap="gap.small">
              <FormInput label="First name" name="firstName" id="first-name-inline" required  onChange={handleChange}/>
              <FormInput label="Last name" name="lastName" id="last-name-inline" required onChange={handleChange}/>
              <FormInput label="VIN" name="vin" id="vin-inline" required onChange={handleChange}/>
              <FormInput label="Registration #" name="regNbr" id="vrm-inline" required onChange={handleChange}/>
            </Flex>
            <Header as="h3" color="brand" content="Fluid Levels" />            
            <Flex gap="gap.small">
              <FormDropdown label="Oil" name="oil" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' required />
              <FormDropdown label="Trasmission" name="transmission" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' required />
              <FormDropdown label="Washer" name="washer" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' required />          
            </Flex>

            <Header as="h3" color="brand" content="Interior" />   
            <Flex gap="gap.medium">
              <FormDropdown label="Fuel Level" name="fuleLevel" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
              <FormDropdown label="Horn" name="horn" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
              <FormDropdown label="Steering Wheel Feel" name="steeringWheel" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
            </Flex>
            <Flex gap="gap.medium">
              <FormDropdown label="Foot Brake" name="footBrake" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
              <FormDropdown label="Parking Brake" name="parkingBrake" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
              <FormDropdown label="Heat/Defrost/AC" name="heatAC" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
            </Flex>
            <Flex gap="gap.medium">
              <FormDropdown label="Interior Lights" name="interiorLights" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
              <FormDropdown label="Upholstry" name="upholstry" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' fontColor="red" />
              <FormDropdown label="Seat belts/Car seats" name="seatBelt" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
            </Flex>

            <Header as="h3" color="brand" content="Exterior" />   
            <Flex gap="gap.medium">
              <FormDropdown label="Head Lights" name="headLight" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
              <FormDropdown label="Turn Signals" name="turnSignals" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' secondaryColor="red" />
              <FormDropdown label="Flashers" name="flashers" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
            </Flex>
            <Flex gap="gap.medium">
              <FormDropdown label="Dents/Scratches" name="dentsScratches" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
              <FormDropdown label="Tail Lights" name="tailLights" onChange={handleDropChange}        items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />
              <FormDropdown label="Tires" name="tires" onChange={handleDropChange} items={['Satisfactory', 'Needs Attention']} defaultValue='Satisfactory' />          
            </Flex>
            <FormCheckbox label="I agree to the Terms and Conditions" id="conditions-inline" required primary/>
            <FormButton content="Submit" primary/>          
          </Form>
        </Flex>
    </div>
  );
}
