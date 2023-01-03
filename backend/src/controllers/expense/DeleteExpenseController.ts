import {Request, Response} from 'express'
import { DeleteExpenseService } from '../../services/expense/DeleteExpenseService';

class DeleteExpenseController {
    async handle(req: Request, res: Response){
        const { id} = req.body;
        
        const user_id = req.user_id as string;
        const created_by = user_id;
        const updated_by = user_id;

        const expense = await new DeleteExpenseService().execute({ id});

        return res.json(expense);

    }
}
    
export { DeleteExpenseController }