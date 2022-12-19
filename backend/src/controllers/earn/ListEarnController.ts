import {Request, Response} from 'express'
import { ListEarnService } from '../../services/earn/ListEarnService'

class ListEarnController {
  async handle(req: Request, res: Response){
    const { id, date, description, value, category_id, goal_period_id, date_compare, date_ini, date_fim} = req.body;
    const listEarnService = new ListEarnService();
    if(date_compare)
     if((date_compare!="=")&&(date_compare!=">=")&&(date_compare!="<=")&&(date_compare!=">")&&(date_compare!="<"))
      throw new Error("Compare Date not valid!")
    const earn = await new ListEarnService().execute({ id, date, description, value, category_id, goal_period_id, date_compare,date_ini, date_fim})
    return res.json(earn);

  }
}

export { ListEarnController }