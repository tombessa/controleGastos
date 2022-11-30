import {Request, Response} from 'express'
import { UpdateAccountService } from '../../services/account/UpdateAccountService'

class UpdateAccountController{
  async handle(req: Request, res: Response){
    const {id, name, type } = req.body;
    
    const user_id = req.user_id as string;    
    const updated_by = user_id;

    const updateAccountService = new UpdateAccountService();

    const account = await updateAccountService.execute({
      id, name, type, updated_by
    });

    return res.json(account);

  }
}

export { UpdateAccountController }