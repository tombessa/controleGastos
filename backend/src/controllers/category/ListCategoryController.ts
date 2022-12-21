import {Request, Response} from 'express'
import { ListCategoryService } from '../../services/category/ListCategoryService'

class ListCategoryController{
  async resume(req: Request, res: Response){
    const { id, name, expense, includeGoal, priority, period} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;

    const category = await new ListCategoryService().resume({id, name, expense, includeGoal, priority, period, created_by})
    return res.json(category);
  }
  async handle(req: Request, res: Response){
    const { id, name, expense, includeGoal, priority} = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    
    const category = await new ListCategoryService().execute({id, name, expense, includeGoal, priority, created_by})
    return res.json(category);

  }
}

export { ListCategoryController }