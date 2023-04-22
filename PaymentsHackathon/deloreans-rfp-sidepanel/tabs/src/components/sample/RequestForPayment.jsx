import "./RequestForPayment.css";
import axios from 'axios';

import {
  Form,
  FormInput,
  FormTextArea,
  FormDatepicker,
  FormButton,
  Flex,
  Button,
  Popup,
  Dialog,
  CloseIcon
} from '@fluentui/react-northstar';
import { MoreIcon } from '@fluentui/react-icons-northstar'
import { useHistory } from "react-router-dom";

let amount = "$1,546.00";

export function RequestForPayment(props) {
  const history = useHistory();

  let handleSubmit = async (e) => {
    const webhookURL = 'https://6g2rrf.webhook.office.com/webhookb2/18556687-90ae-4e12-93ad-f033a4f45a9d@de8bd1e0-78f7-4cd0-aeff-73e09d462d5c/IncomingWebhook/cf5e120fd89348a897c09588947fc9b2/579c7f37-c7d1-4869-89a8-906ad6f02c02';
    axios.post(
      webhookURL,
      {
        text: 'The RFP URL has been sent to the customer for payment.',
      },
      {
        headers: { "content-type": "application/json" },
      }
    );  
      history.push("/feedback");
  }
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
      
        <h4 className="center">Send Request for Payment</h4>
        <Flex>
        <Form method="POST" id='rfpForm' onSubmit={handleSubmit}>
          <FormInput label="Amount" name="amount" id="amount-inline" defaultValue={amount} inline required />
          <FormDatepicker name='requestDate' label="Date" required inline />
          <FormInput label="First name" name="firstName" id="first-name-inline" inline required />
          <FormInput label="Last name" name="lastName" id="last-name-inline" inline required />
          <FormInput label="Account Number" name="accountNbr" id="acct-nbr-inline" inline required />
          <FormInput label="Routing & Transit Number" name="rtNbr" id="rtnbr-inline" inline required />    
          
          <h3>Additional (Invoice)</h3>
          <FormTextArea label="Remittance memo" name="memo" id="memo-inline" inline required />    
          <FormInput label="Reference Information (Service Req #)" name="srNbr" id="ref-info-inline" inline required />   
          
          <FormButton content="Submit" />          
        </Form>        
        </Flex>
    </div>
  );
}
