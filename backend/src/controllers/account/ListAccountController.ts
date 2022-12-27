import {Request, Response} from 'express'
import { ListAccountService } from '../../services/account/ListAccountService'

class ListAccountController{
  
  async resume(req: Request, res: Response){
    const {expense, earn, period} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;

    const listAccountService = new ListAccountService();

    const account = await listAccountService.resume({expense, earn, period, created_by});
    return res.json(account);

  }

  async handle(req: Request, res: Response){
    const { id,type,name } = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;

    const listAccountService = new ListAccountService();

    const account = await listAccountService.execute({id,type,name, created_by});
    return res.json(account);

  }
}

export { ListAccountController }