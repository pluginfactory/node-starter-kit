import { PictureResolver } from '../controllers/resolvers';
/**
 * exposing the general APIs
 */
const prefix = '/api/general/';
export default (app) => {
	app.get(`${prefix}image`, PictureResolver);
};
