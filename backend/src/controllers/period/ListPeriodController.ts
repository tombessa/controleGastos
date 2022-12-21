import {Request, Response} from 'express'
import { ListPeriodService } from '../../services/period/ListPeriodService'

class ListPeriodController{
  async handle(req: Request, res: Response){
    const { id, month, year} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const listPeriodService = new ListPeriodService();
    const period = await new ListPeriodService().execute({ id, month, year, created_by})
    return res.json(period);

  }
}

export { ListPeriodController }