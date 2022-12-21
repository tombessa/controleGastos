import {Request, Response} from 'express'
import { ListExpenseService } from '../../services/expense/ListExpenseService'

class ListExpenseController{

  async handle(req: Request, res: Response){
    const { id, date, description, value, category_id, goal_period_id, date_compare, date_ini, date_fim, account} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const listExpenseService = new ListExpenseService();
    if(date_compare)
     if((date_compare!="=")&&(date_compare!=">=")&&(date_compare!="<=")&&(date_compare!=">")&&(date_compare!="<"))
      throw new Error("Compare Date not valid!")
    const expense = await new ListExpenseService().execute({ id, date, description, value, category_id, goal_period_id, date_compare,date_ini, date_fim, created_by, account})
    return res.json(expense);

  }
}

export { ListExpenseController }