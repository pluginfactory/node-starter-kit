/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
import { FirebasePushNotificationService } from 'appknit-backend-bundle';
import { SampleProcess } from './processes';
/**
 * @description
 * This is the channel that will handle the backend process.
 * The background process must include
 * @author gaurav sharma
 * @since 10th May 2019
 */
export default channel => async (data) => {
	/**
	 * Acknowledge the incoming queue.
	 * Not acknowledging the incoming data will keep the data in
	 * queue and will keep it executing contineously everytime the
	 * RabbitMQ starts.
	 */
	channel.ack(data);
	try {
		/**
		 * @todo handle the queue code here...
		 */
		await SampleProcess();
	} catch (err) {
		console.error(err);
	}
};
