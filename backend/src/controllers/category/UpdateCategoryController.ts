import {Request, Response} from 'express'
import { UpdateCategoryService } from '../../services/category/UpdateCategoryService'

class UpdateCategoryController{
  async handle(req: Request, res: Response){
    const { id, name, expense, priority, includeGoal } = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;

    const updateCategoryService = new UpdateCategoryService();

    const category = await updateCategoryService.execute({
      id, name, expense, includeGoal, priority,  updated_by
    });

    return res.json(category);

  }
}

export { UpdateCategoryController }