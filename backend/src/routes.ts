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
import {CreatePeriodController} from "./controllers/period/CreatePeriodController";
import {UpdatePeriodController} from "./controllers/period/UpdatePeriodController";
import {ListPeriodController} from "./controllers/period/ListPeriodController";
import {DeleteUserController} from "./controllers/user/DeleteUserController";
import {CreateGoalController} from "./controllers/goal/CreateGoalController";
import {UpdateGoalController} from "./controllers/goal/UpdateGoalController";
import {ListGoalController} from "./controllers/goal/ListGoalController";
import {CreateGoalPeriodController} from "./controllers/goalPeriod/CreateGoalPeriodController";
import {ListGoalPeriodController} from "./controllers/goalPeriod/ListGoalPeriodController";
import {UpdateGoalPeriodController} from "./controllers/goalPeriod/UpdateGoalPeriodController";
import {CreateExpenseController} from "./controllers/expense/CreateExpenseController";
import {UpdateExpenseController} from "./controllers/expense/UpdateExpenseController";
import {ListExpenseController} from "./controllers/expense/ListExpenseController";
import {CreateEarnController} from "./controllers/earn/CreateEarnController";
import {UpdateEarnController} from "./controllers/earn/UpdateEarnController";
import {ListEarnController} from "./controllers/earn/ListEarnController";

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

//-- ROTAS USER --
router.post('/users', new CreateUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated,  new DetailuserController().handle )
router.delete('/users', isAuthenticated,  new DeleteUserController().handle )

//-- ROTAS CATEGORY
router.post('/category', isAuthenticated, new CreateCategoryController().handle )
router.patch('/category', isAuthenticated, new UpdateCategoryController().handle )
router.get('/category', isAuthenticated, new ListCategoryController().handle )
router.post('/category/resume', isAuthenticated, new ListCategoryController().resume )

//-- ROTAS ACCOUNT
router.post('/account', isAuthenticated, new CreateAccountController().handle )
router.patch('/account', isAuthenticated, new UpdateAccountController().handle )
router.get('/account', isAuthenticated, new ListAccountController().handle )



//-- ROTAS PERIOD
router.post('/period', isAuthenticated, new CreatePeriodController().handle )
router.patch('/period', isAuthenticated, new UpdatePeriodController().handle )
router.get('/period', isAuthenticated, new ListPeriodController().handle )

//-- ROTAS GOAL
router.post('/goal', isAuthenticated, new CreateGoalController().handle )
router.patch('/goal', isAuthenticated, new UpdateGoalController().handle )
router.get('/goal', isAuthenticated, new ListGoalController().handle )

//-- ROTAS GOAL PERIOD
router.post('/goalPeriod', isAuthenticated, new CreateGoalPeriodController().handle )
router.patch('/goalPeriod', isAuthenticated, new UpdateGoalPeriodController().handle )
router.get('/goalPeriod', isAuthenticated, new ListGoalPeriodController().handle )

//-- ROTAS EXPENSE
router.post('/expense', isAuthenticated, new CreateExpenseController().handle )
router.patch('/expense', isAuthenticated, new UpdateExpenseController().handle )
router.get('/expense', isAuthenticated, new ListExpenseController().handle )

//-- ROTAS EARN
router.post('/earn', isAuthenticated, new CreateEarnController().handle )
router.patch('/earn', isAuthenticated, new UpdateEarnController().handle )
router.get('/earn', isAuthenticated, new ListEarnController().handle )

export { router }; 