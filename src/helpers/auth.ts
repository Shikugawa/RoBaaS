const firebaseAdmin = require('../../app');
import util = require('util');

const authenticateFirebaseAdmin = util.promisify(firebaseAdmin.auth().verifyIDToken);

export const authWithToken = (token: string, res: Express.Response, callback: Function) => {
  authenticateFirebaseAdmin(token)
  .catch(error => callback('failed', res));
};
