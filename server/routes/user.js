import { MultipartService } from 'appknit-backend-bundle';
import {
	AuthenticationControllers,
	UserControllers,
} from '../controllers';

const prefix = '/api/users/';
/**
 * @description
 * This is the route handler for the instructors
 * @author {{app_author}}
 * @since {{app_date}}
 */
export default (app) => {
	app.post(`${prefix}update`, MultipartService, AuthenticationControllers.authenticateUser, UserControllers.update);
	app.post(`${prefix}details`, AuthenticationControllers.authenticateUser, UserControllers.details);
	app.post(`${prefix}resendVerification`, AuthenticationControllers.authenticateUser, UserControllers.resendVerification);
	app.post(`${prefix}verify`, AuthenticationControllers.authenticateUser, UserControllers.verify);
	app.post(`${prefix}removeImage`, AuthenticationControllers.authenticateUser, UserControllers.removeImage);
};
