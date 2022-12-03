import prismaClient from "../../prisma";
import {ListCategoryService} from "../category/ListCategoryService";

interface EarnRequest{
  date: string;
  description: string;
  value: number;
  category_id: string;
  period_id: string;
  created_by: string;
  updated_by: string;
}

class CreateEarnService{
  async execute({ date, description, value, category_id, period_id, created_by, updated_by}: EarnRequest){

    if(date === undefined) throw new Error('Date invalid')
    if(description === undefined) throw new Error('Description invalid')
    if(value === undefined) throw new Error('Value invalid')
    if(category_id === undefined) throw new Error('Category invalid')
    if(period_id === undefined) throw new Error('Period invalid')

    const listCategoryService = new ListCategoryService();
    const category = await listCategoryService.execute({id:category_id, expense:false});
    if(category.length===0)throw new Error('Category is not an Earn')

    const earn = await prismaClient.earn.create({
      data:{
        date: date,
        description: description,
        value: value,
        category_id: category_id,
        period_id: period_id,
        created_by: created_by,
        updated_by: updated_by,
      },
      include:{
        period: true,
        category: true
      }
    })

    return earn;

  }
}

export { CreateEarnService }