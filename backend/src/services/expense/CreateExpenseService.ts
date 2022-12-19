import prismaClient from "../../prisma";
import {ListCategoryService} from "../category/ListCategoryService";

interface ExpenseRequest{
  date: string;
  description: string;
  value: number;
  category_id: string;
  goal_period_id: string;
  created_by: string;
  updated_by: string;
}

class CreateExpenseService{
  async execute({ date, description, value, category_id, goal_period_id, created_by, updated_by}: ExpenseRequest){

    if(date === '') throw new Error('Date invalid')
    if(description === '') throw new Error('Description invalid')
    if(!value) throw new Error('Value invalid')
    if(category_id === '') throw new Error('Category invalid')
    if(goal_period_id === '') throw new Error('Goal Period invalid')

    const listCategoryService = new ListCategoryService();
    const category = await listCategoryService.execute({id:category_id, expense:true});
    if(category.length===0)throw new Error('Category is not an Expense')

    const expense = await prismaClient.expense.create({
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


    return expense;

  }
}

export { CreateExpenseService }