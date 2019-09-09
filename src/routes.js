import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionsController';
import FileController from './app/controllers/FileController';
import SubscriptionController from './app/controllers/SubscriptionController';

import authMiddleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';

const routes = new Router();
const upload = multer(multerConfig);
const uploadBanner = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionsController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store)

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', upload.single('banner'), MeetupController.store);
routes.put('/meetups/:id', upload.single('banner'), MeetupController.update);

routes.post('/subscriptions', SubscriptionController.store);

export default routes;