import throwError from './throwError';
import {validationResult} from 'express-validator';
import {Request} from 'express'

export default (req: Request) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throwError({
      code:  400,
      message: errors.array()[0].msg
    })
	}
};
