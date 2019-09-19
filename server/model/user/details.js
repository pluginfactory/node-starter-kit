import { ResponseUtility } from 'appknit-backend-bundle';
import UsersModel from '../../schemas/user';
/**
 * @description service model function to fetch the details of the user
 * @author {{app_author}}
 * @since {{app_date}}
 */
export default ({
	id,
	userId,
}) => new Promise(async (resolve, reject) => {
	try {
		const lookupQuery = userId ? { ref: userId } : { ref: id };
		const projection = {
			registeredOn: 0,
			lastUpdated: 0,
			__v: 0,
		};
		const user = await UsersModel.findOne(lookupQuery, projection);
		if (!user) {
			return reject(ResponseUtility.NO_USER);
		}
		return resolve(ResponseUtility.SUCCESS({
			data: Object.assign(
				{},
				{ ...user._doc },
				{
					isVerified: user._doc.verification && user._doc.verification.isVerified,
					verification: undefined,
				},
			),
		}));
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ message: err.message, error: err.error }));
	}
});
