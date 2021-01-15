import * as jwt from 'jsonwebtoken';
import {throwError} from '../../utils';
import {authorizationKey} from '../../config/secretKeys';

export default (req, res, next) => {
	const authorization = req.get('Authorization');

	if (!authorization) {
		throwError({
      code: 401,
      message: 'Not Authenticated'
    })
	}

	const token = authorization.split(' ')[1];
	let decodedToken ;

	try {
		decodedToken = jwt.verify(token, authorizationKey)
	} catch (e) {
		throwError({
      code: 500,
      message: 'Cant decode token'
    })
	}

	req.userId = decodedToken.userId;

	next()
};
