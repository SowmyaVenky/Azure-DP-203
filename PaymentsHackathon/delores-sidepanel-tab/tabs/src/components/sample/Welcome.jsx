import "./Welcome.css";
import {
  Form,
  FormInput,
  FormCheckbox,
  FormDatepicker,
  FormButton,
  Flex,
  Button,
  Popup,
  Dialog,
  CloseIcon
} from '@fluentui/react-northstar';
import { MoreIcon } from '@fluentui/react-icons-northstar'

let handleSubmit = async (e) => {
  alert("Condition report has been recorded!");
}

export function Welcome(props) {
  return (
    <div className="welcome page">      
        <Popup trigger={<Button icon={<MoreIcon />} content="View Disclaimer" />} content="I hereby acknowledge that I understand the inherent risks and potential liabilities on having my vehicle's repair(s) undertaken. I likewise declare that I have full and legally binding authority to provide consent for the repair of my vehicle on my premises. I acknowledge the risk of any possible damage that may be incurred during the repair of my vehicle and by which I assume the liability and responsibility of such damage. I hereby authorize the Company to perform all necessary and authorized repairs to my vehicle. In this regard, I understand that they may bring heavy equipment for the purpose of the repairs as quoted and discussed with me. I hereby express my permission for the Company to use my premises to park their vehicle and heavy equipment and assume the potential risks and liabilities associated with such activity on my premises, including any damage to the property whether real or personal." />
        <Dialog
          cancelButton="I do not agree"
          confirmButton="I agree"
          content={{
            content: (
              <>
              <p>
You agree to pay Us upon receipt of Your tax invoice the amounts set out in that tax invoice. All payments must be made in Australian dollars and in immediately available funds and without any deduction or setoff. GST is payable in addition to any price for the Goods and Services provided by Us and must be paid at the same time as the relevant tax invoice.
</p><p>
If any amount is unpaid by the due date then, without prejudice to any other right or remedy We may have, We may charge You a late fee of 2% per annum above Our corporate overdraft rate from time to time calculated on the daily balance of the unpaid amount from the due date until the date of payment in full.
The supply of any Goods or Services by Us does not confer on You any intellectual property rights in the Goods or Services held by Us or any other person.
</p>
<p>
We warrant Our Services to You against defective materials and workmanship for the period of your ownership of the Vehicle. We will make good any defective or faulty workmanship if the defect or damage is attributable to faulty workmanship by us.
Subject to any contrary provision in the Australian Consumer Law:
</p>
<p>
We are only liable to make good faulty workmanship attributable to Our Services and You agree that We are not required to make good the faulty workmanship performed by third parties;
</p>
<p>
We are not liable for any alleged Loss in value of the Vehicle or other consequential damage or Loss as a result of any alleged faulty workmanship and You agree not to make any such claim;
</p>
<p>
We are not liable to rectify or repair any damage or deterioration in the general condition of the Vehicle as a result of normal ageing or usage wear and tear or exposure to the elements and you agree not to make any such claim; and
</p><p>
We are not liable to rectify or repair subsequent damage or deterioration to any particular repair that We have made which is as a result of normal ageing or usage wear and tear or through exposure to the elements or as a result of further damage being sustained to the repaired section of the Vehicle.
</p><p>
This warranty will be void if You fail to comply with these terms and conditions.
</p><p>
If You wish to make a warranty claim, please contact Us using the details set out below, and provide Your name, contact details, Vehicle details, invoice number and a brief description of Your claim.
You must bear the cost of claiming under this warranty. We have no other liability under this warranty, including liability for any loss of Your time or Vehicle use, or for any rental vehicle or transport costs.
</p>
              </>
            ),
            styles: {
              // keep only 1 scrollbar while zooming
              height: '100%',
              maxHeight: '250px',
              overflow: 'auto',
            },
          }}
          header="Terms & Conditions"
          headerAction={{
            icon: <CloseIcon />,
            title: 'Close',
          }}
          trigger={<Button content="Terms & Conditions" />}
        />
      
        <h4 className="center">Vehicle Condition Questions (Check problem areas)</h4>
        <Flex>
        <Form method="POST" id='inspectionreportform' onSubmit={handleSubmit}>
          <FormDatepicker name='inspectiondate' label="Date" required />
          <FormInput label="First name" name="firstName" id="first-name-inline" inline required />
          <FormInput label="Last name" name="lastName" id="last-name-inline" inline required />
          <FormInput label="VIN Number" name="vin" id="vin-inline" inline required />
          <FormInput label="Registration #" name="lastName" id="vrm-inline" inline required />        

          <h3>Vehicle Lighting Checks</h3>
       
          <FormCheckbox label="Left and Right Tail Lights" name="front-lights" id="front-lights" inline required /> 
          <FormCheckbox label="Left and Right Front Indicators" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Left and Right Rear Turn Indicators" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Left and Right Break Lights" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Rear Reverse Light" name="front-lights" id="front-lights" inline required />

          <h3>Vehicle Exterior Body & Glass</h3>
       
          <FormCheckbox label="Windshield Free of Cracks and Chips" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Front Hood, Grill and Bumper Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Mirrors Adjustable and Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Fender Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Doors Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Vehicle is Clean and Free of Road Grime and Dirt" name="front-lights" id="front-lights" inline required />

          <h3>Vehicle Interior</h3>
       
          <FormCheckbox label="Seats in good condition" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Seat belts operational" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Mirrors Adjustable and Free of Damage" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Windscreen Wipers Functioning Appropriately" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Heat and Defroster Operational" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Air Conditioning Operational" name="front-lights" id="front-lights" inline required />

          <h3>Safety Equipment</h3>
       
          <FormCheckbox label="Securely mounted First Aid Kit" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Highway Safety Triangles Available" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Fire Extinguisher Charged and Inspected" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Valid Vehicle Registration is Located" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Valid Vehicle Insurance Certificate is Located" name="front-lights" id="front-lights" inline required />
          <FormCheckbox label="Interior is Clean and Free of Loose Objects" name="front-lights" id="front-lights" inline required />

          <FormButton content="Submit" />          
        </Form>        
        </Flex>
    </div>
  );
}
