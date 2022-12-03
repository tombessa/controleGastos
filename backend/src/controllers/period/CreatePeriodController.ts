import {Request, Response} from 'express'
import { CreatePeriodService } from '../../services/period/CreatePeriodService'

class CreatePeriodController{
  async handle(req: Request, res: Response){
    const { month, year } = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;

    const createPeriodService = new CreatePeriodService();

    const period = await createPeriodService.execute({ month, year, created_by, updated_by});

    return res.json(period);

  }
}

export { CreatePeriodController }