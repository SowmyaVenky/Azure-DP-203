const { MessageFactory, CardFactory } = require('botbuilder');
const {
    ChoicePrompt,
    ChoiceFactory,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
// const { Channels } = require('botbuilder-core');
// const { UserProfile } = require('../userProfile');

const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: "autorepairdb1001.mysql.database.azure.com",  
    user: "autoadmin",    
    //host: 'localhost',
    //user: 'root',
    password: 'Ganesh20022002',
    database: 'autorepair',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const LASTNAME_PROMPT = 'LASTNAME_PROMPT';
const EMAIL_PROMPT = 'EMAIL_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class UserProfileDialog extends ComponentDialog {
    constructor(userState) {
        super('userProfileDialog');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new TextPrompt(LASTNAME_PROMPT, this.lastNameValidator));
        this.addDialog(new TextPrompt(EMAIL_PROMPT, this.emailValidator));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.emailPrompt.bind(this),
            this.emailConfirmStep.bind(this),
            this.nameStep.bind(this),
            this.nameConfirmStep.bind(this),
            this.lookupCustomerStep.bind(this),
            this.customerDetailsConfirmStep.bind(this),
            this.diagnoseVehicleStep.bind(this),
            this.approveDiagnostics.bind(this),
            this.finalApprovalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /** Ask user to enter their email address */
    async emailPrompt(step) {
        return await step.prompt(EMAIL_PROMPT, 'Please enter your email address.');
    }

    /** This is a validator to validate email entered */
    async emailValidator(promptContext) {
        let isGoodEmail = false;
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (promptContext.recognized.value.match(validRegex)) {
            isGoodEmail = true;
        }
        return promptContext.recognized.succeeded && isGoodEmail;
    }

    async emailConfirmStep(step) {
        step.values.email = step.result;

        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(`Your email address is: ${ step.result }.`);

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT, 'Is this correct?', ['yes', 'no']);
    }

    async nameStep(step) {
        if (step.result) {
            step.values.transport = step.result.value;
            return await step.prompt(LASTNAME_PROMPT, 'Please enter your last name.');
        }
        return await step.endDialog();
    }

    /** This is a validator to validate lastname entered */
    async lastNameValidator(promptContext) {
        let isGoodLastName = false;
        const validRegex = /^[A-Za-z]+$/;
        if (promptContext.recognized.value.match(validRegex)) {
            isGoodLastName = true;
        }
        return promptContext.recognized.succeeded && isGoodLastName;
    }

    async nameConfirmStep(step) {
        step.values.name = step.result;

        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(`Your last name is: ${ step.result }.`);

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT, 'Is this correct?', ['yes', 'no']);
    }

    async lookupCustomerStep(step) {
        if (step.result) {
            const params = [step.values.email.toUpperCase(), step.values.name.toUpperCase()];
            // console.log(params);
            const sql = 'SELECT * FROM autorepair.customer WHERE upper(email) = ? and upper(lastname) = ?';
            let customerFirstName = '';
            let customerLastName = '';
            let customerPhone = '';
            let customerCreditCard = '';
            const customerEmail = step.values.email;
            let customerTitle = '';
            let address = '';
            let address2 = '';
            let city = '';
            let state = '';
            let zip = '';

            const rows = await pool.query(sql, params);
            // console.log(rows[0].length);
            // console.log(rows[0][0]);
            customerFirstName = rows[0][0].firstname;
            customerLastName = rows[0][0].lastname;
            customerPhone = rows[0][0].phone;
            customerCreditCard = rows[0][0].creditcard;
            customerTitle = rows[0][0].title;
            address = rows[0][0].address;
            address2 = rows[0][0].address2;
            city = rows[0][0].city;
            state = rows[0][0].state;
            zip = rows[0][0].zip;

            const customerCard = CardFactory.adaptiveCard(
                {
                    type: 'AdaptiveCard',
                    body: [
                        {
                            type: 'TextBlock',
                            size: 'Large',
                            weight: 'Bolder',
                            text: 'Hello ' + customerFirstName + ' ' + customerLastName
                        },
                        {
                            type: 'TextBlock',
                            size: 'Medium',
                            text: 'Title: ' + customerTitle,
                            wrap: true
                        },
                        {
                            type: 'TextBlock',
                            size: 'Medium',
                            text: 'Address: ' + address + ' ' + address2 + ' ' + city + ' ' + state + ' ' + zip,
                            wrap: true
                        },
                        {
                            type: 'TextBlock',
                            size: 'Large',
                            text: 'Phone: ' + customerPhone + 'Email: ' + customerEmail,
                            wrap: true
                        },
                        {
                            type: 'TextBlock',
                            size: 'Medium',
                            text: 'Credit Card: ' + customerCreditCard,
                            wrap: true
                        }
                    ],
                    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                    version: '1.0'
                }
            );

            if (customerFirstName !== '') {
                await step.context.sendActivity({
                    text: 'Here is the information we found about you:',
                    attachments: [customerCard]
                });
                return await step.prompt(CONFIRM_PROMPT, 'Is this correct?', ['yes', 'no']);
            } else {
                await step.context.sendActivity('Customer could not be found, please re-try!');
            }
        }

        // The user entered no on name, so ignore lookup and end conversation. 
        return await step.endDialog();
    }

    async customerDetailsConfirmStep(step) {
        if (step.result) {
            const params = [step.values.email.toUpperCase(), step.values.name.toUpperCase()];
            const sql =
              'select distinct vehicle_color, vehicle_fuel, vehicle_manufacturer, vehicle_model, vehicle_type, vehicle_vrm, vehicle_vin ' +
              'from ' +
              'autorepair.customer C ' +
              'LEFT JOIN ' +
              'autorepair.service_records SR ' +
              'on C.id = SR.customer_id ' +
              'LEFT JOIN ' +
              'autorepair.employee E ' +
              'on E.id = SR.employee_id WHERE upper(email) = ? and upper(lastname) = ?';
            const rows = await pool.query(sql, params);
            const vehicles = [];
            const vehicleCards = [];

            rows[0].forEach(row => {
                const vehicleCard = CardFactory.adaptiveCard(
                    {
                        type: 'AdaptiveCard',
                        body: [
                            {
                                type: 'TextBlock',
                                size: 'Large',
                                weight: 'Bolder',
                                text: 'VIN ' + row.vehicle_vin + ', VRM ' + row.vehicle_vrm
                            },
                            {
                                type: 'TextBlock',
                                size: 'Medium',
                                text: 'Color: ' + row.vehicle_color + ', Fuel ' + row.vehicle_fuel,
                                wrap: true
                            },
                            {
                                type: 'TextBlock',
                                size: 'Medium',
                                text: 'Make: ' + row.vehicle_manufacturer,
                                wrap: true
                            },
                            {
                                type: 'TextBlock',
                                size: 'Large',
                                text: 'Model: ' + row.vehicle_model,
                                wrap: true
                            },
                            {
                                type: 'TextBlock',
                                size: 'Medium',
                                text: 'Type: ' + row.vehicle_type,
                                wrap: true
                            }
                        ],
                        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                        version: '1.0'
                    }
                );
                vehicleCards.push(vehicleCard);
                vehicles.push(row.vehicle_vin);
            });

            await step.context.sendActivity({ attachments: vehicleCards });
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'Please select vehicle to diagnose...',
                choices: ChoiceFactory.toChoices(vehicles)
            });
        }

        return await step.endDialog();
    }

    /** Display diagnostic details (Fake) */
    async diagnoseVehicleStep(step) {
        step.values.vehicle_vin = step.result;
        // We query the DB and pick something random.
        const sql = 'select distinct vehicle_problem from autorepair.service_records limit 25';
        const rows = await pool.query(sql);
        const problems = [];
        rows[0].forEach(row => {
            problems.push(row.vehicle_problem);
        });

        const selectedProblems = [];
        const min = 2;
        const max = 5;
        const itemstoselect = Math.floor(Math.random() * (max - min + 1) + min);

        for (let x = 0; x < itemstoselect; x++) {
            const problem1 = problems[Math.floor(Math.random() * problems.length)];
            selectedProblems.push(problem1);
        }

        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please select from the detected problems.',
            choices: ChoiceFactory.toChoices(selectedProblems)
        });
    }

    /** Ask for approval */
    async approveDiagnostics(step) {
        step.values.vehicle_problem = step.result;
        const params = [step.values.vehicle_problem.value.toUpperCase()];
        // console.log(step.values.vehicle_problem.value);
        // We query the DB and pick something random.
        const sql = 'select min(vehicle_repair_cost) as mincost, max(vehicle_repair_cost) as maxcost from autorepair.service_records where upper(vehicle_problem) = ?';
        const rows = await pool.query(sql, params);
        const mincost = rows[0][0].mincost;
        const maxcost = rows[0][0].maxcost;
        const msg = 'The vehicle problem type ' + step.values.vehicle_problem.value + ' usually costs between $' + mincost + ' and $' + maxcost;
        return await step.prompt(CONFIRM_PROMPT, msg + ' Is this ok?', ['yes', 'no']);
    }

    /** Final approval */
    async finalApprovalStep(step) {
        if (step.result) {
            await step.prompt(LASTNAME_PROMPT, 'Thanks so much, a service ticket has been created and a service admin will call you!');
            await step.prompt(LASTNAME_PROMPT, 'Type anything to restart conversation');
            return await step.endDialog();
        }

        await step.prompt(LASTNAME_PROMPT, 'No problem, please let us know how we can help!');
        await step.prompt(LASTNAME_PROMPT, 'Type anything to restart conversation');
        return await step.endDialog();
    }
}

module.exports.UserProfileDialog = UserProfileDialog;
