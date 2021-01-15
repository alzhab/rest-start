import {UserService} from '../../../services';
import {NextFunction, Request, Response} from 'express';
import {catchError, checkErrors, getReqUserId, throwError} from '../../../utils';
import {BaseController} from '../../../abstract/base.controller';
import {UserI, UserLoginI, UserPatchI} from '../../../interfaces/user.interface';
import {UserServiceI} from '../../../services/user.service';

class UserController extends BaseController<UserI, UserLoginI, UserPatchI, UserServiceI> {
  constructor() {
    super(UserService)
  }

  updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Проверка express-validator
      checkErrors(req);

      // @ts-ignore
      const file = req.file;

      if (!file) {
        throwError({
          code: 422,
          message: 'No image provided.'
        })
      }

      const userId = getReqUserId(req);
      const avatarPath = file.path;

      // Новый пользователь
      const result = await this.service.updateAvatar({
        userId,
        avatarPath
      });

      res.status(200).json(result)
    } catch (e) {
      catchError(e, next)
    }
  };

  deleteAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Проверка express-validator
      checkErrors(req);

      const userId = getReqUserId(req);

      // Новый пользователь
      const result = await this.service.deleteAvatar(userId);

      res.status(200).json(result)
    } catch (e) {
      catchError(e, next)
    }
  };
}

const userController = new UserController();

export default userController;
