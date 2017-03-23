import docusign from 'docusign-esign';
import { docusignConf, contactsList, resideAgentData } from './config';

const checkForRequiredConfig = () => {
  if (!docusignConf.integratorKey) {
    throw Error('Docusign Config must be set in src/utils.js or env variables (see README)');
  }
  if (!contactsList[0].email) {
    throw Error('Contact email must be set in src/utils.js (see README)');
  }
  if (!resideAgentData.email) {
    throw Error('Reside Agent Data must be set in src/utils.js (see README)');
  }
}

/**
 * @description Setup docusign including default headers
 */
const setup = () => {
  checkForRequiredConfig();

  // initialize the api client
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(docusignConf.basePath);

  // create JSON formatted auth header
  const creds = JSON.stringify({
    Username: docusignConf.email,
    Password: docusignConf.password,
    IntegratorKey: docusignConf.integratorKey,
  });

  // configure DocuSign authentication header
  apiClient.addDefaultHeader('X-DocuSign-Authentication', creds);

  // assign api client to the Configuration object
  docusign.Configuration.default.setDefaultApiClient(apiClient);
};

/**
 * @description Login to Docusign
 * @return {Array} Array of login accounts
 */
export const login = () => {
  // setup docusign
  setup();
  // login call available off the AuthenticationApi
  const authApi = new docusign.AuthenticationApi();

  // login has some optional parameters we can set
  const loginOps = new authApi.LoginOptions();
  loginOps.setApiPassword('true');
  loginOps.setIncludeAccountIdGuid('true');

  return new Promise((resolve, reject) => {
    authApi.login(loginOps, (err, loginInfo) => {
      if (err) {
        console.error('Error from Docusign Login:', err); // eslint-disable-line no-console
        reject(err);
      } else {
        resolve({ loginAccounts: loginInfo.getLoginAccounts() });
      }
    });
  });
};

export default { login };
