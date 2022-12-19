import {Request, Response} from 'express'
import { CreateGoalService } from '../../services/goal/CreateGoalService';

class CreateGoalController{
  async handle(req: Request, res: Response){
    const { amount, category_id } = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;

    const createGoalService = new CreateGoalService();    
    const goal = await createGoalService.execute({ amount, created_by, updated_by, category_id});
    return res.json(goal);

  }
}

export { CreateGoalController }