import {Request, Response} from 'express'
import { UpdatePeriodService } from '../../services/period/UpdatePeriodService'

class UpdatePeriodController{
  async handle(req: Request, res: Response){
    const { id, month, year} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;

    const updatePeriodService = new UpdatePeriodService();

    const period = await updatePeriodService.execute({ id, month, year,  updated_by});

    return res.json(period);

  }
}

export { UpdatePeriodController }