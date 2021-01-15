import {NextFunction, Response, Request} from 'express';

export default (error, req: Request, res: Response, next: NextFunction) => {
  const {statusCode = 500, message = 'Error', data} = error;

	res.status(statusCode).json({message, data})
};
