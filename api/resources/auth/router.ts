import AuthController from './controller';
import {BaseRouter} from '../../../abstract/base.router';
import {checkCode, checkEmailExist, checkEmailNotExist, checkPassword, checkUsername} from './validators';

class AuthRouter extends BaseRouter<typeof AuthController> {
  constructor() {
    super(
      'auth',
      AuthController,
      [
        {
          method: 'post',
          route: '/signup',
          validators: [
            checkEmailNotExist,
            checkPassword,
            checkUsername
          ],
          request: AuthController.signup,
        },
        {
          method: 'post',
          route: '/login',
          validators: [
            checkEmailExist,
            checkPassword
          ],
          request: AuthController.login,
        },
        {
          method: 'post',
          route: '/reset-code',
          validators: [
            checkEmailExist
          ],
          request: AuthController.genResetCode,
        },
        {
          method: 'post',
          route: '/check-reset-code',
          validators: [
            checkEmailExist,
            checkCode
          ],
          request: AuthController.checkResetCode,
        },
        {
          method: 'post',
          route: '/reset-password',
          validators: [
            checkPassword
          ],
          request: AuthController.resetPassword,
        },
      ]
    )
  }
}

export default new AuthRouter().router;
