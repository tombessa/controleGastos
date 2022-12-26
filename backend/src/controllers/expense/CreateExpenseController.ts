import {Request, Response} from 'express'
import { CreateExpenseService } from '../../services/expense/CreateExpenseService'

class CreateExpenseController{
  async handle(req: Request, res: Response){
    const { date, description, value, category_id, goal_period_id, bank_id, account} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;

    const createExpenseService = new CreateExpenseService();
    

    const Expense = await createExpenseService.execute({ date, description, value, category_id, goal_period_id, account, bank_id, created_by, updated_by});

    return res.json(Expense);

  }
}

export { CreateExpenseController }