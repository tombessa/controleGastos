import {Request, Response} from 'express'
import { ListCategoryService } from '../../services/category/ListCategoryService'

class ListCategoryController{
  async handle(req: Request, res: Response){
    const { id, name, expense, includeGoal, priority} = req.body;
    const listCategoryService = new ListCategoryService();
    const category = await new ListCategoryService().execute({id, name, expense, includeGoal, priority})
    return res.json(category);

  }
}

export { ListCategoryController }