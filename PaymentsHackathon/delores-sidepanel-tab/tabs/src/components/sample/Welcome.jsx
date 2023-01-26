import "./Welcome.css";
import {
  Form,
  FormInput,
  FormCheckbox,
  FormDatepicker,
  FormButton,
  Flex
} from '@fluentui/react-northstar';

let handleSubmit = async (e) => {
  alert("Condition report has been recorded!");
}

export function Welcome(props) {
  return (
    <div className="welcome page">
        <h3 className="center">Vehicle Condition Questions</h3>
        <Flex>
        <Form method="POST" id='inspectionreportform' onSubmit={handleSubmit}>
          <FormDatepicker name='inspectiondate' label="Date" required />
          <FormInput label="First name" name="firstName" id="first-name-inline" inline required />
          <FormInput label="Last name" name="lastName" id="last-name-inline" inline required />
          <FormInput label="VIN Number" name="vin" id="vin-inline" inline required />
          <FormInput label="Registration #" name="lastName" id="vrm-inline" inline required />        

          <h3>Vehicle Lighting Checks</h3>
       
          <FormCheckbox checked label="Left and Right Tail Lights" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Left and Right Front Indicators" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Left and Right Rear Turn Indicators" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Left and Right Break Lights" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Rear Reverse Light" name="front-lights" id="front-lights" inline required />

          <h3>Vehicle Exterior Body & Glass</h3>
       
          <FormCheckbox checked label="Windshield Free of Cracks and Chips" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Front Hood, Grill and Bumper Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Mirrors Adjustable and Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Fender Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Doors Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Vehicle is Clean and Free of Road Grime and Dirt" name="front-lights" id="front-lights" inline required />

          <h3>Vehicle Interior</h3>
       
          <FormCheckbox checked label="Seats in good condition" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Seat belts operational" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Mirrors Adjustable and Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Windscreen Wipers Functioning Appropriately" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Heat and Defroster Operational" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Air Conditioning Operational" name="front-lights" id="front-lights" inline required />

          <h3>Safety Equipment</h3>
       
          <FormCheckbox checked label="Securely mounted First Aid Kit" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Highway Safety Triangles Available" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Fire Extinguisher Charged and Inspected" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Valid Vehicle Registration is Located" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Valid Vehicle Insurance Certificate is Located" name="front-lights" id="front-lights" inline required />
          <FormCheckbox checked label="Interior is Clean and Free of Loose Objects" name="front-lights" id="front-lights" inline required />

          <FormButton content="Submit" />          
        </Form>
        </Flex>
    </div>
  );
}
