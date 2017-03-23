/* eslint-disable arrow-body-style, no-console */
import docusign from 'docusign-esign';
import { each, get } from 'lodash';
import { login } from './utils';
import { contactsList, resideAgentData } from './config';

const recipientIdMap = {
  agent: 1,
  client1: 2,
  client2: 3,
  client3: 4,
  client4: 5,
};

/**
 * @description Remove nulls from envelope object
 * Needed in order to get the text tabs to go through w/o issue:
 * * http://stackoverflow.com/questions/36871943/docusign-request-returns-error-only-when-tabs-set
 * * https://github.com/docusign/docusign-node-client/issues/47
 * @param {Object} transaction - Tranasction data object
 * @param {Object} resideAgent - Agent data object
 * @return {Object}
 */
const removeNulls = (envelope) => {
  const isArray = envelope instanceof Array;
  for (const k in envelope) { // eslint-disable-line
    if (envelope[k] === null) isArray ? obj.splice(k, 1) : delete envelope[k];  // eslint-disable-line
    else if (typeof envelope[k] === 'object') removeNulls(envelope[k]);
    if (isArray && envelope.length === k) removeNulls(envelope);
  }
  return envelope;
};

/**
 * @description Create a recipients object
 * @param {Object} transaction - Tranasction data object
 * @param {Object} resideAgent - Agent data object
 * @return {Object}
 */
const createRecipientsObject = (contacts, resideAgent) => {
  // add recipients to sign the document
  const recipients = {
    agent: new docusign.Signer(),
  };
  recipients.agent.setEmail(resideAgent.email);
  recipients.agent.setName(resideAgent.displayName);
  // The agent is always the first recipient and signer
  recipients.agent.setRecipientId('1');
  recipients.agent.setRoutingOrder('1');

  each(contacts, (contact, index) => {
    const clientKey = `client${index + 1}`;
    recipients[clientKey] = new docusign.Signer();
    recipients[clientKey].setEmail(contact.email);
    recipients[clientKey].setName(`${contact.firstname} ${contact.lastname}`);
    recipients[clientKey].setRecipientId(index + 2);
    recipients[clientKey].setRoutingOrder('1');
  });

  return recipients;
};

const createEnvelopeDef = () => {
  // Create an envelope
  const envDef = new docusign.EnvelopeDefinition();
  envDef.setEmailSubject(`test - ${Date.now()}`);

  // Set up variables where we will place transformed data
  const initialHereTabs = {};
  const signHereTabs = {};

  envDef.setRecipients(new docusign.Recipients());

  // Create a recipients object for the agent + transaction contacts
  const recipients = createRecipientsObject(contactsList, resideAgentData);

  // Go through each document to collect data for the envelope
  const pdfUrl = 'https://dl.dropboxusercontent.com/u/4241134/CAR%20PDFs%20v2/CARListAgmntExclusive.pdf';
  const pdfName = 'Res Listing Agreement CAR';
  const inputs = [
    {
      recipientId: 'client1',
      left: 755,
      top: 1484,
      name: 'Seller1initial',
      type: 'initial',
      pageNumber: 4,
    },
    {
      recipientId: 'client1',
      left: 584,
      top: 305,
      name: 'Seller1initial',
      type: 'initial',
      pageNumber: 5,
    },
    {
      recipientId: 'client1',
      left: 672,
      top: 305,
      name: 'Seller1initial',
      type: 'signature',
      pageNumber: 5,
    },
    {
      recipientId: 'client1',
      left: 145,
      top: 955,
      name: 'Seller1initial',
      type: 'signature',
      pageNumber: 5,
    },
  ];
  const doc = new docusign.Document();
  doc.setRemoteUrl(pdfUrl);
  doc.setName(pdfName);
  doc.setFileExtension('pdf');
  doc.setDocumentId(1);
  const initialVerticalOffset = -15;

  // For each input, set to tabs object with correct config
  each(inputs, (input) => {
    switch (input.type) {
      case 'signature': {
        const signHere = new docusign.SignHere();
        signHere.setRecipientId(recipientIdMap[input.recipientId]);
        signHere.setXPosition(parseInt(input.left / 2, 10) - 3);
        signHere.setYPosition(parseInt(input.top / 2, 10) + initialVerticalOffset);
        signHere.setScaleValue(0.5);

        signHere.setDocumentId(1);
        signHere.setPageNumber(input.pageNumber);

        signHereTabs[input.recipientId] = signHereTabs[input.recipientId] || [];
        signHereTabs[input.recipientId].push(signHere);
        break;
      }
      case 'initial': {
        const initial = new docusign.InitialHere();
        initial.setRecipientId(recipientIdMap[input.recipientId]);
        initial.setXPosition(parseInt(input.left / 2, 10) - 3);
        initial.setYPosition(parseInt(input.top / 2, 10) + initialVerticalOffset);
        initial.setScaleValue(0.5);
        initial.setDocumentId(1);
        initial.setPageNumber(input.pageNumber);

        initialHereTabs[input.recipientId] = initialHereTabs[input.recipientId] || [];
        initialHereTabs[input.recipientId].push(initial);
        break;
      }
      default: {
        console.log('Invalid input type');
      }
    }
  });


  // Set all the tab types for all the clients
  // We'll need a each loop for all clients
  each(Object.keys(recipients), (recipientKey) => {
    const tabs = new docusign.Tabs();
    tabs.setSignHereTabs(signHereTabs[recipientKey]);
    tabs.setInitialHereTabs(initialHereTabs[recipientKey]);


    recipients[recipientKey].setTabs(removeNulls(tabs));
    // Finally add this recipient
    envDef.getRecipients().getSigners().push(recipients[recipientKey]);
  });

  envDef.setDocuments([doc, doc, doc]);
  return envDef;
};

/**
 * @description Submit to docusign and update transaction with status
 * @param {Object} envDef - Envelope definition
 * @return {Promise}
 */
const sendEnvelope = (envDef) => {
  return login()
    .then((auth) => {
      return new Promise((resolve, reject) => {
        // send the envelope by setting |status| to "sent"
        envDef.setStatus('sent');

        // instantiate a new EnvelopesApi object
        const envelopesApi = new docusign.EnvelopesApi();

        // call the createEnvelope() API
        envelopesApi.createEnvelope(auth.loginAccounts[0].accountId, envDef, null, (createEnvelopeError, envelopeSummary, response) => {
          if (createEnvelopeError) {
            const errorMessage = get(response, 'body.message', 'Error creating Docusign Envelope');
            console.error(`Error in createEnvelope: ${errorMessage}`);
            reject(errorMessage);
          } else if (envelopeSummary) {
            console.log(`EnvelopeSummary: ${JSON.stringify(envelopeSummary)}`);
            resolve({ success: true });
          }
        });
      });
    });
};

/**
 * @description Submit to docusign
 * @return {Promise}
 */
const submitToDocusign = () => {
  const envDef = createEnvelopeDef();
  return sendEnvelope(envDef)
    .catch((sendDocsError) => {
      console.error(`Error sending docs to Docusign for signing: ${sendDocsError}`);
      return Promise.reject(sendDocsError);
    });
};

/**
 * @description Self executing anonymous function for running by calling
 */
(() => {
  submitToDocusign();
})();
