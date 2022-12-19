import {Request, Response} from 'express'
import { ListExpenseService } from '../../services/expense/ListExpenseService'

class ListExpenseController{
  async handle(req: Request, res: Response){
    const { id, date, description, value, category_id, goal_period_id, date_compare, date_ini, date_fim} = req.body;
    const listExpenseService = new ListExpenseService();
    if(date_compare)
     if((date_compare!="=")&&(date_compare!=">=")&&(date_compare!="<=")&&(date_compare!=">")&&(date_compare!="<"))
      throw new Error("Compare Date not valid!")
    const expense = await new ListExpenseService().execute({ id, date, description, value, category_id, goal_period_id, date_compare,date_ini, date_fim})
    return res.json(expense);

  }
}

export { ListExpenseController }