import {body, ValidationChain} from 'express-validator';
import {throwError} from '../../../utils';
import {UserService} from '../../../services';

export const checkEmailNotExist: ValidationChain = body('email')
  .notEmpty().withMessage('Email required')
  .isEmail().withMessage('Email invalid')
  .custom(async (value, {req}) => {
    const count = await UserService.count({where: {email: value}});

    if (count) {
      throwError({
        code: 409,
        message: 'User with this email already exist'
      })
    }
  });

export const checkEmailExist: ValidationChain = body('email')
  .notEmpty().withMessage('Email required')
  .isEmail().withMessage('Email invalid')
  .custom(async (value, {req}) => {
    const count = await UserService.count({where: {email: value}});

    if (!count) {
      throwError({
        code: 409,
        message: 'User with this email not found'
      })
    }
  });

export const checkPassword: ValidationChain = body('password')
  .notEmpty().withMessage('Password required')
  .isLength({min:5}).withMessage('Password min length - 5');

export const checkUsername: ValidationChain = body('username')
  .notEmpty().withMessage('Username required')
  .custom((value, {req}) => {
    const [surname, name] = value.trim().split(' ');

    if (!surname) {
      throwError({
        code: 404,
        message: 'Surname in username required'
      })
    }

    if (!name) {
      throwError({
        code: 404,
        message: 'Name in username required'
      })
    }

    return true
  });

export const checkCode: ValidationChain = body('code')
  .notEmpty().withMessage('Code is required');
