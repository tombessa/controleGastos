import {Request, Response} from 'express'
import { UpdateEarnService } from '../../services/earn/UpdateEarnService'

class UpdateEarnController {
  async handle(req: Request, res: Response){
    const { id, date, description, value, category_id, goal_period_id} = req.body;
    
    const user_id = req.user_id as string;
    const updated_by = user_id;

    const updateEarnService = new UpdateEarnService();

    const earn = await updateEarnService.execute({ id, date, description, value, category_id, goal_period_id,  updated_by});

    return res.json(earn);

  }
}

export { UpdateEarnController }