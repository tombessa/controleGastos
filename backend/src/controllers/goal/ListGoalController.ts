import {Request, Response} from 'express'
import { ListGoalService } from '../../services/goal/ListGoalService'


class ListGoalController{
  async handle(req: Request, res: Response){
    const { id, amount, category_id, amount_compare} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const listGoalService = new ListGoalService();
    if(amount_compare)
      if((amount_compare!="=")&&(amount_compare!=">=")&&(amount_compare!="<=")&&(amount_compare!=">")&&(amount_compare!="<"))
        throw new Error("Compare Amount not valid!")
    const goal = await new ListGoalService().execute({ id, amount, category_id, amount_compare, created_by})
    return res.json(goal);

  }
}

export { ListGoalController }