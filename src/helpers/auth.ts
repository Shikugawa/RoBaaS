const firebaseAdmin = require('../../app');

export const authWithToken = (token: string, res: Express.Response, callback: Function) => {
  firebaseAdmin.auth().verifyIDToken(token)
  .catch(error => callback('failed', res));
};
