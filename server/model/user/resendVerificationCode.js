import {
	PropsValidationUtility,
	ResponseUtility,
	RandomCodeUtility,
} from 'appknit-backend-bundle';
import { UsersModel } from '../../schemas';

const validProps = ['phoneCode', 'phoneNumber'];
/**
 * @description service model function to resend the verification
 * code in case it was not already received.
 * @author {{app_author}}
 * @since {{app_date}}
 */
export default ({
	id,
	phoneCode,
	phoneNumber,
}) => new Promise(async (resolve, reject) => {
	try {
		const { code, message } = await PropsValidationUtility({
			validProps,
			sourceDocument: {
				phoneCode,
				phoneNumber,
			},
		});
		if (code !== 100) {
			return reject(ResponseUtility.MISSING_PROPS({ message }));
		}
		const verificationCode = RandomCodeUtility(6);

		// check if the number is not already taken except by the user
		const numberTaken = await UsersModel.findOne({
			ref: { $ne: id },
			'mobile.code': phoneCode,
			'mobile.number': phoneNumber,
		});
		if (numberTaken) {
			return reject(ResponseUtility.GENERIC_ERR({ message: 'Phone number is already taken.' }));
		}
		const updateQuery = {
			'verification.verificationCode': verificationCode,
			'verification.verificationCodeTimestamp': Date.now(),
			'verification.retryAttempt': 0,
			'verification.isVerified': false,
			'mobile.code': phoneCode,
			'mobile.number': phoneNumber,
		};

		await UsersModel.update({ ref: id }, updateQuery);
		return resolve(ResponseUtility.SUCCESS());
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ message: err.message, error: err.error }));
	}
});
