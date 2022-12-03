import {Request, Response} from 'express'
import { UpdateGoalService } from '../../services/goal/UpdateGoalService'

class UpdateGoalController{
  async handle(req: Request, res: Response){
    const { id, amount, category_id} = req.body;
    
    const user_id = req.user_id as string;
    const updated_by = user_id;

    const updateGoalService = new UpdateGoalService();

    const goal = await updateGoalService.execute({ id, amount, category_id,  updated_by});

    return res.json(goal);

  }
}

export { UpdateGoalController }