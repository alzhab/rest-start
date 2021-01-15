import {NextFunction, Request, Response} from 'express';
import {AuthService} from '../../../services';
import {catchError, checkErrors, getReqUserId} from '../../../utils';
import eventEmitter from '../../../subscribes/eventEmitter';
import authEvents from './events';

class AuthController {
  constructor(private service: typeof AuthService) {
  }

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Проверка express-validator
      checkErrors(req);

      eventEmitter.emit(authEvents.signup);

      // Новый пользователь
      const result = await this.service.signup(req.body);

      res.status(200).json(result)
    } catch (e) {
      catchError(e, next)
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Проверка express-validator
      checkErrors(req);

      // Проверить пользователь
      const result = await this.service.login(req.body);

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next)
    }
  };

  genResetCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Проверка express-validator
      checkErrors(req);

      const {email} = req.body;

      const result = await this.service.generateResetCode(email);

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next)
    }
  };

  checkResetCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Проверка express-validator
      checkErrors(req);

      const {email, code} = req.body;

      const result = await this.service.checkResetCode({email, code});

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next)
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Проверка express-validator
      checkErrors(req);

      const {password} = req.body;
      const userId = getReqUserId(req);

      const result = await this.service.resetPassword({userId, password});

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next)
    }
  };
}

const authController = new AuthController(AuthService);

export default authController
