import {Request, Response} from 'express'
import { CreateGoalPeriodService } from '../../services/goalPeriod/CreateGoalPeriodService'

class CreateGoalPeriodController{
  async handle(req: Request, res: Response){
    const { amount, period_id, category_id } = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;

    const createGoalPeriodService = new CreateGoalPeriodService();

    const goalPeriod = await createGoalPeriodService.execute({ amount, created_by, updated_by, category_id, period_id});

    return res.json(goalPeriod);

  }
}

export { CreateGoalPeriodController }