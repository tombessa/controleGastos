import prismaClient from "../../prisma";
import {ListCategoryService} from "../category/ListCategoryService";

interface EarnRequest{
  date: string;
  description: string;
  value: number;
  category_id: string;
  goal_period_id: string;
  created_by: string;
  updated_by: string;
}

class CreateEarnService{
  async execute({ date, description, value, category_id, goal_period_id, created_by, updated_by}: EarnRequest){

    if(date === undefined) throw new Error('Date invalid')
    if(description === undefined) throw new Error('Description invalid')
    if(value === undefined) throw new Error('Value invalid')
    if(category_id === undefined) throw new Error('Category invalid')
    if(goal_period_id === undefined) throw new Error('Goal Period invalid')

    const listCategoryService = new ListCategoryService();
    const category = await listCategoryService.execute({id:category_id, expense:false});
    if(category.length===0)throw new Error('Category is not an Earn')

    const earn = await prismaClient.earn.create({
      data:{
        date: date,
        description: description,
        value: value,
        category_id: category_id,
        goal_period_id: goal_period_id,
        created_by: created_by,
        updated_by: updated_by,
      },
      include:{
        goalPeriod: true,
        category: true
      }
    })

    return earn;

  }
}

export { CreateEarnService }