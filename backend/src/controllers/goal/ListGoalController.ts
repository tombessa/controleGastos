import {Request, Response} from 'express'
import { ListGoalService } from '../../services/goal/ListGoalService'


class ListGoalController{
  async handle(req: Request, res: Response){
    const { id, amount, category_id, amount_compare} = req.body;
    const listGoalService = new ListGoalService();
    if(amount_compare)
      if((amount_compare!="=")&&(amount_compare!=">=")&&(amount_compare!="<=")&&(amount_compare!=">")&&(amount_compare!="<"))
        throw new Error("Compare Amount not valid!")
    const goal = await new ListGoalService().execute({ id, amount, category_id, amount_compare})
    return res.json(goal);

  }
}

export { ListGoalController }