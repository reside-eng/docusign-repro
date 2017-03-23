const {
  DOCUSIGN_INTEGRATOR_KEY,
  DOCUSIGN_EMAIL,
  DOCUSIGN_PASSWORD,
} = process.env;

export const docusignConf = {
  integratorKey: DOCUSIGN_INTEGRATOR_KEY || '',  // required
  email: DOCUSIGN_EMAIL || '',  // required
  password: DOCUSIGN_PASSWORD || '', // required
  basePath: 'https://demo.docusign.net/restapi',
};

export const contactsList = [
  {
    email: '',  // required
    firstname: 'Harry',
    lastname: 'Schultz',
  },
];

export const resideAgentData = {
  email: '',  // required
  displayName: 'Some Guy',
};

export default { docusignConf, contactsList, resideAgentData };
