import userController from './controller';
import {isAuth} from '../../middlewares';
import uploads from '../../../storage/uploads';
import {BaseRouter} from '../../../abstract/base.router';

class UserRouter extends BaseRouter {
  constructor() {
    super(
      'users',
      userController,
      [
        {
          route: '/avatar',
          method: 'post',
          middlewares: [isAuth, uploads.imagesUpload.single('image')],
          request: userController.updateAvatar
        },
        {
          route: '/avatar',
          method: 'delete',
          middlewares: [isAuth],
          request: userController.deleteAvatar
        }
      ]
    )
  }
}

export default new UserRouter().router;
