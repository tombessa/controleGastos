import {Request, Response} from 'express'
import { UpdateExpenseService } from '../../services/expense/UpdateExpenseService'

class UpdateExpenseController{
  async handle(req: Request, res: Response){
    const { id, date, description, value, category_id, goal_period_id, bank_id, account} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;

    const updateExpenseService = new UpdateExpenseService();

    const expense = await updateExpenseService.execute({ id, date, description, value, category_id, goal_period_id, bank_id, account, created_by, updated_by});

    return res.json(expense);

  }
}

export { UpdateExpenseController }