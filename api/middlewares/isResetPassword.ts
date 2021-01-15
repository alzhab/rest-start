import {throwError} from '../../utils';
import * as jwt from 'jsonwebtoken';
import {resetPasswordKey} from '../../config/secretKeys';

export default (req, res, next) => {
  const authorization = req.get('Authorization');

  if (!authorization) {
    throwError({
      code: 404,
      message: 'Token not set'
    });
  }

  const token = authorization.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, resetPasswordKey);
  } catch (e) {
    throwError({
      code: 500,
      message: 'Cant decode token'
    });
  }

  req.userId = decodedToken.userId;
  next();
};
