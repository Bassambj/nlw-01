import express, { Router } from 'express';
import { celebrate, Joi} from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post(
    '/points',
     upload.single('image'),
     celebrate({ // validação: body, querys, parms, cooks, formularios etc
         body: Joi.object().keys({
             name: Joi.string().required(), // tem que ser string e é obrigatório
             email: Joi.string().required().email(),
             whatsapp: Joi.number().required(),
             latitude: Joi.number().required(),
             longitude: Joi.number().required(),
             city: Joi.string().required(),
             uf: Joi.string().required().max(2),
             items: Joi.array().required()//Testei e aceitou array
         })
     }, 
     {
         abortEarly: false 
         //Faz todas as validações ao mesmo tempo.
     }
     ),   
     pointsController.create
);

export default routes;