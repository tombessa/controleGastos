import {Request, Response} from 'express'
import { ListAccountService } from '../../services/account/ListAccountService'

class ListAccountController{
  async handle(req: Request, res: Response){
    const { id,type,name } = req.body;

    const listAccountService = new ListAccountService();

    const account = await listAccountService.execute({id,type,name});

    return res.json(account);

  }
}

export { ListAccountController }