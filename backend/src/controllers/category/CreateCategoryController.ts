import {Request, Response} from 'express'
import { CreateCategoryService } from '../../services/category/CreateCategoryService'

class CreateCategoryController{
  async handle(req: Request, res: Response){
    const { name, expense, includeGoal } = req.body;
    
    const user_id = req.user_id as string;
    const created_by = user_id;
    const updated_by = user_id;

    const createCategoryService = new CreateCategoryService();

    const category = await createCategoryService.execute({
      name,
      expense,
      includeGoal,
      created_by,
      updated_by
    });

    return res.json(category);

  }
}

export { CreateCategoryController }