import {Request, Response} from 'express'
import { ListGoalPeriodService } from '../../services/goalPeriod/ListGoalPeriodService'

class ListGoalPeriodController{
  async handle(req: Request, res: Response){
    const { id, amount, category_id, period_id, amount_compare, period, category} = req.body;
    
    const listGoalPeriodService = new ListGoalPeriodService();
    if(amount_compare)
      if((amount_compare!="=")&&(amount_compare!=">=")&&(amount_compare!="<=")&&(amount_compare!=">")&&(amount_compare!="<"))
        throw new Error("Compare Amount not valid!")
    const goalPeriod = await new ListGoalPeriodService().execute({ id, amount,category_id, period_id, amount_compare, period, category})
    return res.json(goalPeriod);

  }
}

export { ListGoalPeriodController }