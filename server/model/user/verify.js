import {
	ResponseUtility,
	PropsValidationUtility,
	TimeConversionUtility,
} from 'appknit-backend-bundle';
import { UsersModel } from '../../schemas';

const validProps = ['otpCode'];
/**
 * @description handle the otp verificiation process
 * @author {{app_author}}
 * @since {{app_date}}
 */
export default ({
	id,
	otpCode,
}) => new Promise(async (resolve, reject) => {
	try {
		const { code, message } = await PropsValidationUtility({
			validProps,
			sourceDocument: {
				otpCode,
			},
		});
		if (code !== 100) {
			return reject(ResponseUtility.MISSING_PROPS({ message }));
		}
		const user = await UsersModel.findOne({ ref: id });
		if (!user) {
			return reject(ResponseUtility.NO_USER());
		}
		if (user.verification && !user.verification.isVerified) {
			if (user.verification.verificationCode === otpCode) {
				if (user.verificationCodeTimestamp + TimeConversionUtility.daysToMillis(1) < Date.now()) {
					return reject(ResponseUtility.TOKEN_EXPIRED);
				}
				const updateQuery = {
					$unset: {
						'verification.verificationCode': 1,
						'verification.verificationCodeTimestamp': 1,
						'verification.retryAttempt': 1,
					},
					$set: { 'verification.isVerified': true },
				};
				await UsersModel.update({ ref: id }, updateQuery);
				return resolve(ResponseUtility.SUCCESS());
			}
			if (user.verification.retryAttempt >= 3) {
				return reject(ResponseUtility.TOKEN_TRY_EXPIRED);
			}
			await UsersModel.update({ ref: id }, { $inc: { 'verification.retryAttempt': 1 } });
			return reject(ResponseUtility.GENERIC_ERR({ message: 'Verification code does not match.' }));
		}
		return resolve(ResponseUtility.SUCCESS({ message: 'Already verified.' }));
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ error: err.error, message: err.message }));
	}
});
