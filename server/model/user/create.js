import {
	ResponseUtility,
	SchemaMapperUtility,
	RandomCodeUtility,
	S3Services,
} from 'appknit-backend-bundle';
import UsersModel from '../../schemas/user';
import {
	S3_BUCKET,
	NODE_ENV,
} from '../../constants';
/**
 * @description service model function to handle the creation
 * This is a common function that could be used to create as
 * well as update the existing user.
 * of the new user. This will handle the profile completion process
 * @author {{app_author}}
 * @since {{app_date}}
 *
 */
export default ({
	id,
	phoneCode,
	phoneNumber,
	day,
	month,
	year,
	gender,
	nationality,
	about,
	picture,
}) => new Promise(async (resolve, reject) => {
	try {
		if (!id || !(phoneCode || phoneNumber || day || month
			|| year || gender || nationality
			|| about || picture)) {
			return reject(ResponseUtility.MISSING_PROPS({ message: 'Missing either of the required properties.' }));
		}
		const lookupQuery = { ref: id };
		const verificationCode = (phoneCode && phoneNumber) ? RandomCodeUtility(6) : undefined;
		/**
		 * @todo process sending the verification code via twilio
		 */
		const pictureName = picture ? `profile_${Date.now()}` :  undefined;
		if (pictureName) {
			const Bucket = `${S3_BUCKET}/${NODE_ENV}/profile`;
			const Key = pictureName;

			await S3Services.uploadToBucket({ Key, Bucket, data: picture });
		}

		const updateQuery = await SchemaMapperUtility({
			ref: id,
			picture: pictureName,
			mobile: verificationCode ? {
				code: phoneCode,
				number: phoneNumber,
			} : undefined,
			dob: (day && month && year) ? {
				day, month, year,
			} : undefined,
			verification: verificationCode ? {
				isVerified: false,
				verificationCode,
				verificationCodeTimestamp: Date.now(),
				retryAttempt: 0,
			} : undefined,
			gender,
			nationality,
			about,
			lastUpdated: Date.now(),
		});

		await UsersModel.findOneAndUpdate(lookupQuery, updateQuery, { upsert: true, new: true });
		return resolve(ResponseUtility.SUCCESS());
	} catch (err) {
		return reject(ResponseUtility.GENERIC_ERR({ message: 'There was some error.', error: err }));
	}
});
