import {Request, Response} from 'express'
import { ListPeriodService } from '../../services/period/ListPeriodService'

class ListPeriodController{
  async handle(req: Request, res: Response){
    const { id, month, year} = req.body;
    const listPeriodService = new ListPeriodService();
    const period = await new ListPeriodService().execute({ id, month, year})
    return res.json(period);

  }
}

export { ListPeriodController }