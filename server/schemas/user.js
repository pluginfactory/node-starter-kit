/**
 * This schema represents the users profile schema
 * @author {{app_author}}
 * @since {{app_date}}
 */
import { Schema } from 'mongoose';
import database from '../db';

const User = new Schema({
	name: { type: String },
	mobile: {
		code: String,
		number: Number,
	},
	dob: {
		day: Number,
		month: Number,
		year: Number,
	},
	verification: {
		isVerified: Boolean,
		verificationCode: Number,
		verificationCodeTimestamp: Number,
		retryAttempt: Number,
	},
	gender: Number,
	nationality: String,
	about: String,
	registeredOn: Number,
	lastUpdated: Number,
	picture: String,
	profileCompletion: { type: Number, default: 0 },
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

User.virtual('userEntity', {
	ref: 'Entity',
	localField: 'ref',
	foreignField: '_id',
	justOne: true,
});


export default database.model('User', User);
