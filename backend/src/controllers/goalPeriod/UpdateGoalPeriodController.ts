import {Request, Response} from 'express'
import { UpdateGoalPeriodService } from '../../services/goalPeriod/UpdateGoalPeriodService'

class UpdateGoalPeriodController{
  async handle(req: Request, res: Response){
    const { id, amount, category_id, period_id} = req.body;
    
    const user_id = req.user_id as string;
    const updated_by = user_id;

    const updateGoalPeriodService = new UpdateGoalPeriodService();

    const goalPeriod = await updateGoalPeriodService.execute({ id, amount, category_id, period_id,  updated_by});

    return res.json(goalPeriod);

  }
}

export { UpdateGoalPeriodController }