/**
 * this file deals with the authentication services
 * Uses a common authentication function and token identifier as role
 * to specify at the time of serializing the token.
 *
 * @todo The role specified is straight forward as of now.
 * It could be secured by using random string for each role of user.
 *
 * @author {{app_author}}
 * @since {{app_date}}
 */
import { TokenUtility } from 'appknit-backend-bundle';

/**
 * common authenticator function
 * @param {*} authorization header value
 * @param {String} type representing the user-type value
 */
const prepareDecodedData = ({ authorization, type }) => new Promise((resolve, reject) => {
	const decoded = TokenUtility.decodeToken(authorization);
	if (decoded) {
		const { data: { email, id, role } } = decoded;
		if (role === type) {
			return resolve({ type, email, id });
		}
	}
	reject();
});

/**
 * common token decoding and authentication handler
 * @param {*} req the request object
 * @param {*} res the response object
 * @param {*} next the next callback
 * @param {*} type the type of user/ this could be some code to validate
 */
const commonDecodingHandler = ({
	req,
	res,
	next,
	type,
}) => {
	const { headers: { authorization } } = req;
	if (authorization) {
		prepareDecodedData({ authorization, type })
			.then((payload) => {
				if (payload) {
					const body = Object.assign({}, req.body, payload);
					req.body = body;
					return next();
				}
			}).catch(() => res.status(401).send({ code: 401, message: 'Token might be invalid or has been expired', error: 'Token Invalid.' }));
	} else {
		res.status(400).send({ code: 400, message: 'Malformed Request', error: 'Missing Headers' });
	}
};

export default {
	authenticateUser: (req, res, next) => commonDecodingHandler({ req, res, next, type: 'user' }),
	authenticateAdmin: (req, res, next) => commonDecodingHandler({ req, res, next, type: 'admin' }),
};
