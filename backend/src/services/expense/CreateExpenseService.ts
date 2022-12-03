import prismaClient from "../../prisma";
import {ListCategoryService} from "../category/ListCategoryService";

interface ExpenseRequest{
  date: string;
  description: string;
  value: number;
  category_id: string;
  period_id: string;
  created_by: string;
  updated_by: string;
}

class CreateExpenseService{
  async execute({ date, description, value, category_id, period_id, created_by, updated_by}: ExpenseRequest){

    if(date === '') throw new Error('Date invalid')
    if(description === '') throw new Error('Description invalid')
    if(!value) throw new Error('Value invalid')
    if(category_id === '') throw new Error('Category invalid')
    if(period_id === '') throw new Error('Period invalid')

    const listCategoryService = new ListCategoryService();
    const category = await listCategoryService.execute({id:category_id, expense:true});
    if(category.length===0)throw new Error('Category is not an Expense')

    const expense = await prismaClient.expense.create({
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


    return expense;

  }
}

export { CreateExpenseService }