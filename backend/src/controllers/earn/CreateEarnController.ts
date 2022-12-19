import {Request, Response} from 'express'
import { CreateEarnService } from '../../services/earn/CreateEarnService'
import {ListCategoryController} from "../category/ListCategoryController";

class CreateEarnController {
  async handle(req: Request, res: Response){
    const { date, description, value, category_id, goal_period_id} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;


    const createEarnService = new CreateEarnService();

    const Earn = await createEarnService.execute({ date, description, value, category_id, goal_period_id, created_by, updated_by});

    return res.json(Earn);

  }
}

export { CreateEarnController }