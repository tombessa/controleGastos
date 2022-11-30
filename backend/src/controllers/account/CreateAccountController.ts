import {Request, Response} from 'express'
import { CreateAccountService } from '../../services/account/CreateAccountService'

class CreateAccountController{
  async handle(req: Request, res: Response){
    const { name, type } = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;

    const createAccountService = new CreateAccountService();

    const category = await createAccountService.execute({
      name, type, created_by, updated_by
    });

    return res.json(category);

  }
}

export { CreateAccountController }