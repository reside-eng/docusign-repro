export const docusignConf = {
  integratorKey: '',  // required
  email: '',  // required
  password: '', // required
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
