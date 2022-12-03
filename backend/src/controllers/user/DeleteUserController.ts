import {Request, Response} from 'express'
import { DeleteUserService } from '../../services/user/DeleteUserService'

class DeleteUserController {
  async handle(req: Request, res: Response){
    const { id } = req.body;
    
    const user_id = req.user_id as string;
    const update_by = user_id;

    const deleteUserService = new DeleteUserService();

    const user = await deleteUserService.execute({ id, update_by});

    return res.json(user);

  }
}

export { DeleteUserController }