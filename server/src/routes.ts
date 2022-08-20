import express from 'express';
import {celebrate, Joi} from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import UsersController from './controllers/UsersController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();
const usersController = new UsersController();

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/specific_points', pointsController.specific_index);
routes.get('/points/:id', pointsController.show);
routes.post(
  '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      offer: Joi.string().required(),
      user_email: Joi.string().required(),
    }),
  }, {
    abortEarly: false,
  }),
  pointsController.create
);
routes.patch(
  '/points/:id',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      offer: Joi.string().required(),
      user_email: Joi.string().required(),
    }),
  }, {
    abortEarly: false,
  }),
  pointsController.update
);
routes.delete(
  '/points/:id',
  pointsController.delete
)

routes.get('/users', usersController.index);
routes.get('/users/:id', usersController.show);
routes.post(
  '/users',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      cpf_or_cnpj: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }, {
    abortEarly: false,
  }),
  usersController.create
);
routes.patch(
  '/users/:id',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      cpf_or_cnpj: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }, {
    abortEarly: false,
  }),
  usersController.update
);
routes.delete(
  '/users/:id',
  usersController.delete
)

export default routes;