import {adminAuthorizationKey, authorizationKey, resetPasswordKey} from '../config/secretKeys';
import * as jwt from 'jsonwebtoken'

export const genAuthToken = (userId: string) => {
  return jwt.sign(
    {userId},
    authorizationKey
  );
};

export const genResetPasswordToken = (userId: string) => {
  return jwt.sign(
    {userId},
    resetPasswordKey,
    {expiresIn: '5m'}
  );
};

export const genAdminPasswordToken = (userId: string) => {
  return jwt.sign(
    {userId},
    adminAuthorizationKey
  );
};




