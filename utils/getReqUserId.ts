import {Request} from 'express';
import throwError from './throwError';

const getReqUserId = (req: Request) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    throwError({
      code: 404,
      message: 'User id not defined'
    })
  }

  return userId
};

export default getReqUserId
