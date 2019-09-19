import amqplib from 'amqplib/callback_api';
import fs from 'fs';
import { ResponseUtility } from 'appknit-backend-bundle';
import {
	RABBITMQ_HOST,
	RABBITMQ_USER,
	RABBITMQ_PASSWORD,
	RABBITMQ_HEARTBEAT,
} from '../constants';

const AMQP_URI = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}/${RABBITMQ_USER}?heartbeat=${RABBITMQ_HEARTBEAT}`;
/**
 * @description
 * activator for the queues for the express object passed. The
 * Queue directory files are auto-loaded here unless explicitly ignored
 * via skip array. The Queue names are imported camelcased by capitalizing 
 * the first letter of queue channel. For example, The queue channel named
 * "notificationQueue.js" will be assigned a name "NotificationsQueue" on AMQP
 * and hence must be mapped in constants.js so that services could reference it.
 * For every queue channel defined in this folder, The corresponding "AMQP_QUEUES"
 * mapping must be added in "constants.js" to enable discovery and lookups. Every
 * unfinihished or underdevelopmed queue channel must be put in skip array to avoid the
 * runtime execeptions.
 * For any doubts and queries regarding the design principles
 * @contact sharma02gaurav@gmail.com
 * @author {{app_author}}
 * @since {{app_date}}
 */
export default () => new Promise((resolve, reject) => {
	amqplib.connect(AMQP_URI, (err, connection) => {
		if (err) {
			return reject(ResponseUtility.CONN_ERR({ message: 'Error establishing connection with the amqp server', error: err }));
		}
		console.log('Connected to RabbitMQ server.');
		connection.createChannel((channelError, channel) => {
			if (channelError) {
				throw new Error(ResponseUtility.CONN_ERR({ message: 'Error creating AMQP channel', error: err }));
			}
			const skip = ['index.js', '.DS_Store'];
			const files = fs.readdirSync(__dirname);

			files.map((file) => {
				const found = skip.find(skipThisFile => skipThisFile === file);
				if (!found) {
					const fileName = `${file.charAt(0).toUpperCase()}${file.split('.')[0].substring(1, file.length)}`;
					const callbackFunction = require(`./${file}`).default;
					channel.assertQueue(fileName, { durable: true });
					channel.consume(fileName, callbackFunction(channel));
				}
			});
			return resolve({ AMQPChannel: channel, AMQPConnection: connection });
		});
	});
});
