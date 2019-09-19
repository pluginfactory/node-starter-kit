/**
* This is the {{app_name}} constant file
* @author {{app_author}}
* @since {{app_date}}
*/

export const {
	NODE_ENV = 'development',
	S3_BUCKET = '',
	// atlas configurations
	ATLAS_USER,
	ATLAS_PASSWORD,
	CLUSTER1,
	CLUSTER2,
	CLUSTER3,
	SHARD,
	SECRET_STRING,
	PAGINATION_LIMIT = 30,
	// RabbitMQ configuration
	RABBITMQ_HOST,
	RABBITMQ_USER,
	RABBITMQ_PASSWORD,
	RABBITMQ_HEARTBEAT,
} = process.env;

const db = process.env.MONGO_DB || '{{app_name}}';

/**
 * @description
 * This is the sample constact specifier for queues
 * The queue names follow follow the "camelcase" naming
 * convention wehere the first letter of the queue will
 * be capital case. The queue channels are defined under server/queues/
 * directory and will be autoloded by directory indexer unless explicitly
 * ignored in skip array in index.js. The sampleQueue.js is a sample
 * channel that is meant to be updated/renamed as per the queue requirements.
 * To know more about the channel convention and design principles
 * @contact sharma02gaurav@gmail.com
 */
export const AMQP_QUEUES = {
	SAMPLE_QUEUE: 'SampleQueue',
};

// export const mongoConnectionString = `mongodb://${host}:${port}/${db}`;
export const mongoConnectionString = `mongodb+srv://${ATLAS_USER}:${ATLAS_PASSWORD}@usermicroservice-5jre5.mongodb.net/${db}?retryWrites=true`;

// this string is unique for each project construction
export const secretString = SECRET_STRING;

export const SUCCESS_CODE = 100;

export const MB = 1024 * 1024;
