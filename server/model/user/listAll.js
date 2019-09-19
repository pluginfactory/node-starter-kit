import { ResponseUtility } from 'appknit-backend-bundle';
import { UsersModel } from '../../schemas';
/**
 * @description
 * service model function to list down all the users registered on the platform.
 * @author {{app_author}}
 * @since {{app_date}}
 */
export default ({
	page = 1,
	limit = 30,
}) => new Promise(async (resolve, reject) => {
	try {
		const options = { skip: limit * (page - 1) };
		const users = await UsersModel.find({}, { __v: 0 }, options);
		const refactoredResponses = [];

		users.map(user => refactoredResponses.push(Object.assign({}, { ...user._doc })));
		return resolve(ResponseUtility.SUCCESS_PAGINATION({ data: refactoredResponses, page, limit }));
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ error: err.error, message: err.message }));
	}
});
