import { S3Services } from 'appknit-backend-bundle';
import { S3_BUCKET, NODE_ENV } from '../../constants';
import sharp from 'sharp';
/**
 * This moudule acts as a common handler for picture fetching since all the controllers
 * follows almost the same design pattern, making a commong handler function will help to
 * eventually reduce the code base and redundant code.
 * @author gaurav sharma
 * @since Monday, October 1, 2018 12:59 PM
 *
 * @param {*} req
 * @param {*} res
 *
 * @todo Handle authentication middleware injections?
*/
export default (req, res) => {
	const { query: { path = 'profile', identifier = 'avatar.png', height = 400, width = 400, format = 'jpg' } } = req;
	const Bucket = `${S3_BUCKET}/${NODE_ENV}/${path}`;
	const Key = identifier;
	res.type(`image/${format}`);
	S3Services.findFile({ Bucket, Key })
		.then((success) => {
			const { data: { Body } } = success;
			if (width && height) {
				sharp(Body)
					.resize(parseInt(width), parseInt(height))
					.toFormat(format)
					.pipe(res);
			} else {
				sharp(Body)
					.toFormat(format)
					.pipe(res);
			}
		}).catch((err) => {
			console.error(err);
			/**
			 * return the default image.
			 */
			const alterBucket = `${S3_BUCKET}/${NODE_ENV}`;
			const alterKey = 'avatar.png';
			S3Services.findFile({ Bucket: alterBucket, Key: alterKey })
				.then((success) => {
					const { data: { Body } } = success;
					sharp(Body)
						.resize({ height, width })
						.pipe(res);
				}).catch((err) => {
					console.error(err);
				});
		});
};
