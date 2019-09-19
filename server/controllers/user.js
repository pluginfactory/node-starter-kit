/**
* 
*/
import { UserModel } from '../model';
import { ModelResolver } from './resolvers';

export default {
	update: (req, res) => ModelResolver(req, res, UserModel.UsersCreateService),
	details: (req, res) => ModelResolver(req, res, UserModel.UsersDetailsService),
	resendVerification: (req, res) => ModelResolver(req, res, UserModel.UsersResendVerificationCodeService),
	verify: (req, res) => ModelResolver(req, res, UserModel.UsersVerifyService),
	removeImage: (req, res) => ModelResolver(req, res, UserModel.UsersRemoveImageService),
};
