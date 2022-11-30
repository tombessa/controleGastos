import { Router } from 'express';
import multer from 'multer';
import { isAuthenticated } from './middlewares/isAuthenticated'
import uploadConfig from './config/multer'

//Controller
import { CreateUserController } from './controllers/user/CreateUserController'
import { AuthUserController } from './controllers/user/AuthUserController'
import { DetailuserController } from './controllers/user/DetailUserController'

import { CreateCategoryController } from './controllers/category/CreateCategoryController'
import { ListCategoryController } from './controllers/category/ListCategoryController'
import { UpdateCategoryController } from './controllers/category/UpdateCategoryController';
import { CreateAccountController } from './controllers/account/CreateAccountController';
import { UpdateAccountController } from './controllers/account/UpdateAccountController';
import { ListAccountController } from './controllers/account/ListAccountController';

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

//-- ROTAS USER --
router.post('/users', new CreateUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated,  new DetailuserController().handle )

//-- ROTAS CATEGORY
router.post('/category', isAuthenticated, new CreateCategoryController().handle )
router.patch('/category', isAuthenticated, new UpdateCategoryController().handle )
router.get('/category', isAuthenticated, new ListCategoryController().handle )

//-- ROTAS ACCOUNT
router.post('/account', isAuthenticated, new CreateAccountController().handle )
router.patch('/account', isAuthenticated, new UpdateAccountController().handle )
router.get('/account', isAuthenticated, new ListAccountController().handle )


export { router }; 